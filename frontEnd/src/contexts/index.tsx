import React, { FC } from 'react';
import { AuthContextProvider } from './authContext';
import { MessageContextProvider } from './messageContext';
interface Props {
  children: React.ReactNode;
}
const AppContext: FC<Props> = ({ children }) => {
  return (
    <MessageContextProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </MessageContextProvider>
  );
};
export default AppContext;
