import React, { createContext, useContext, useReducer, FC } from 'react';
import { Message } from './model/message';
interface Props {
  children: React.ReactNode;
}
interface Action {
  type: ACTION_TYPE | string;
  payload: any;
}
interface MessageContext {
  state: Message;
  dispatch: React.Dispatch<Action>;
}
enum ACTION_TYPE {
  SET_MESSAGE = 'SET_MESSAGE',
  CLEAR_MESSAGE = 'CLEAR_MESSAGE',
}
const initialState: Message = {
  type: 'success',
  title: '',
  content: '',
  delay: 0,
};
const messageContext: React.Context<{}> = createContext({});
export function useMessage(): MessageContext {
  return useContext(messageContext) as MessageContext;
}
export const MessageContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer((state: Message, action: Action) => {
    const { type, payload } = action;
    switch (type) {
      case ACTION_TYPE.SET_MESSAGE:
        return {
          ...state,
          type: payload.type,
          title: payload.title,
          icon: payload.icon,
          content: payload.content,
          delay: payload.delay,
        };
      case ACTION_TYPE.CLEAR_MESSAGE:
        return { ...state, ...initialState };
      default:
        return state;
    }
  }, initialState);
  return (
    <>
      <messageContext.Provider value={{ state, dispatch }}>
        {children}
      </messageContext.Provider>
    </>
  );
};
