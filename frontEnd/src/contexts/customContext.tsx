import React, { createContext, FC, useContext } from 'react';
import { Custom } from './model/custom';
import { ResponseData } from '@/api/request';
import { getSystem } from '@/api/system';
interface Props {
  children: React.ReactNode;
}
interface Action {
  type: ACTION_TYPE;
  payload: any;
}
interface CustomContext {
  state: Custom;
  dispatch: React.Dispatch<Action>;
  getSystemInfo: Function;
}
enum ACTION_TYPE {
  SET_DATA = 'SET_DATA',
}
const sessionData = JSON.parse(sessionStorage.getItem('custom') || '{}');
const initialState: Custom = {
  logo: sessionData.logo || '',
  system_name: sessionData.system_name || '',
  copyright: sessionData.copyrigt || '',
  custom_home: sessionData.custom_home || '',
};

const customContext: React.Context<{}> = createContext({});
export function useCustom(): CustomContext {
  return useContext(customContext) as CustomContext;
}

export const CustomContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (state: Custom, action: Action) => {
      const { type, payload } = action;
      switch (type) {
        case ACTION_TYPE.SET_DATA:
          return { ...state, ...payload };
        default:
          return state;
      }
    },
    initialState
  );
  const getSystemInfo = async (): Promise<ResponseData> => {
    const result = await getSystem();
    if (result.code === 200) {
      dispatch({
        type: ACTION_TYPE.SET_DATA,
        payload: result.data,
      });
    }
    return result;
  };
  return (
    <>
      <customContext.Provider
        value={{
          state,
          dispatch,
          getSystemInfo,
        }}>
        {children}
      </customContext.Provider>
    </>
  );
};
