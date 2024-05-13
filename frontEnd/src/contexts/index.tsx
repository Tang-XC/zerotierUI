import React, { FC } from 'react';
import { AuthContextProvider } from './authContext';
import { MessageContextProvider } from './messageContext';
import { CustomContextProvider } from './customContext';
import { StepContextProvider } from './stepContext';
interface Props {
  children: React.ReactNode;
}
const AppContext: FC<Props> = ({ children }) => {
  return (
    <StepContextProvider>
      <CustomContextProvider>
        <MessageContextProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </MessageContextProvider>
      </CustomContextProvider>
    </StepContextProvider>
  );
};
export default AppContext;
