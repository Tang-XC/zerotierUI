import React, { FC } from 'react';
import { AuthContextProvider } from './authContext';
import { MessageContextProvider } from './messageContext';
import { CustomContextProvider } from './customContext';
interface Props {
  children: React.ReactNode;
}
const AppContext: FC<Props> = ({ children }) => {
  return (
    <CustomContextProvider>
      <MessageContextProvider>
        <AuthContextProvider>{children}</AuthContextProvider>
      </MessageContextProvider>
    </CustomContextProvider>
  );
};
export default AppContext;
