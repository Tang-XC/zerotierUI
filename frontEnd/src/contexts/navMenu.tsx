import React, { createContext, FC, useReducer } from 'react';
import { RouteItem } from '@/route';
interface Props {
  children: React.ReactNode;
}
interface NavMenu {
  navMenu: RouteItem[];
}
interface Action {
  type: string;
  payload: any;
}
interface NavMenuContext {
  state: NavMenu;
  dispatch: Function;
}
enum ACTION_TYPE {
  SET_NAV_MENU = 'SET_NAV_MENU',
}
const initialState = {
  navMenu: [],
};
const navMenuContext: React.Context<{}> = createContext({});
export function useNavMenu(): NavMenuContext {
  return React.useContext(navMenuContext) as NavMenuContext;
}
export const NavMenuProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(
    (state: NavMenu, action: Action): NavMenu => {
      const { type, payload } = action;
      switch (type) {
        case ACTION_TYPE.SET_NAV_MENU:
          return { ...state, navMenu: payload };
        default:
          return state;
      }
    },
    initialState
  );
  return (
    <navMenuContext.Provider
      value={{
        state,
        dispatch,
      }}>
      {children}
    </navMenuContext.Provider>
  );
};
