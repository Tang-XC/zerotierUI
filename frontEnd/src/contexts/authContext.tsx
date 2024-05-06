import React, { createContext, FC, useContext } from 'react';
import { User } from './model/auth';
import { getUser, signIn as signInApi, SignInData, getRole } from '@/api/user';
import { ResponseData } from '@/api/request';
interface Props {
  children: React.ReactNode;
}
interface Action {
  type: ACTION_TYPE;
  payload: any;
}
interface AuthContext {
  state: User;
  dispatch: React.Dispatch<Action>;
  getUserInfo: Function;
  signIn: Function;
  signOut: Function;
}
enum ACTION_TYPE {
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  SET_USER_INFO = 'SET_USER_INFO',
  SIGN_OUT = 'SIGN_OUT',
}
const sessionData = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
const initialState: User = {
  id: sessionData.id || 0,
  name: sessionData.name || '',
  account: sessionData.account || '',
  avatar: sessionData.avatar || '',
  email: sessionData.email || '',
  phone: sessionData.phone || '',
  token: sessionStorage.getItem('token') || '',
  roles: sessionData.roles || [],
  permissions: [],
};
const authContext: React.Context<{}> = createContext({});
export function useAuth(): AuthContext {
  return useContext(authContext) as AuthContext;
}
export const AuthContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = React.useReducer((state: User, action: Action) => {
    const { type, payload } = action;
    switch (type) {
      case ACTION_TYPE.SIGN_IN:
        return { ...state, token: payload };
      case ACTION_TYPE.SET_USER_INFO:
        let result = {
          ...state,
          ...payload,
        };
        return result;
      case ACTION_TYPE.SIGN_OUT:
        return { ...state, ...initialState, token: '' };
      default:
        return state;
    }
  }, initialState);
  const getUserInfo = async (): Promise<ResponseData> => {
    const result = await getUser();
    if (result.code === 200) {
      dispatch({
        type: ACTION_TYPE.SET_USER_INFO,
        payload: result.data,
      });
      sessionStorage.setItem('userInfo', JSON.stringify(result.data));
      if (result.data.roles && result.data.roles.length !== 0) {
        const id = result.data.roles[0].id;
        const roleResult = await getRole(id);
        if (roleResult.code === 200) {
          dispatch({
            type: ACTION_TYPE.SET_USER_INFO,
            payload: {
              permissions: roleResult.data.permissions.map(
                (item: any) => item.tag
              ),
            },
          });
        }
      }
    }
    return result;
  };
  const signIn = async (data: SignInData): Promise<ResponseData> => {
    const result = await signInApi(data);
    if (result.code === 200) {
      dispatch({
        type: ACTION_TYPE.SIGN_IN,
        payload: result.data.token,
      });
      sessionStorage.setItem('token', result.data.token);
      await getUserInfo();
    }
    return result;
  };
  const signOut = (): void => {
    dispatch({
      type: ACTION_TYPE.SIGN_OUT,
      payload: null,
    });
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
  };

  return (
    <>
      <authContext.Provider
        value={{ state, dispatch, getUserInfo, signIn, signOut }}>
        {children}
      </authContext.Provider>
    </>
  );
};
