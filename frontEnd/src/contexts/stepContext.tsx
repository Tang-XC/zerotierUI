import React, { createContext, FC, useContext } from 'react';
import { Steps } from './model/steps';
interface Props {
  children: React.ReactNode;
}
interface Action {
  type: ACTION_TYPE;
  payload: any;
}
interface stepsContext {
  state: Steps;
  dispatch: React.Dispatch<Action>;
}
enum ACTION_TYPE {
  SET_STEPS = 'SET_STEPS',
  SET_SKIP = 'SET_SKIP',
  SET_NETWORK_ADD_DIALOG = 'SET_NETWORK_ADD_DIALOG',
  SET_STEP_INDEX = 'SET_STEP_INDEX',
}
const sessionData = !(localStorage.getItem('isSkip') === 'true');
const initialState: Steps = {
  steps: [
    {
      target: '.step-one',
      content: '点击进入网络列表',
      data: {
        path: '/network',
      },
    },
    {
      target: '.step-two',
      content: '点击添加，创建新的网络，创建完成后点击详情进行配置',
    },
    {
      title: (
        <h3 style={{ textAlign: 'left', padding: 0, margin: 0 }}>欢迎使用</h3>
      ),
      target: '.step-three',
      content: (
        <p style={{ padding: 0, margin: 0, textAlign: 'left' }}>
          配置网络名称、网段、网关、DNS等信息，点击保存
        </p>
      ),
      placement: 'center',
    },
  ],
  openNetSteps: [
    {
      disableBeacon: true,
      content: '打开网络详情，进行配置',
      target: '.step-four',
    },
  ],
  configNetSteps: [
    {
      disableBeacon: true,
      content: '点击设置，进行网络配置',
      target: '.step-five',
    },
  ],
  lastConfigNetSteps: [
    {
      disableBeacon: true,
      content:
        '点击生成网络地址后，直接提交,即完成快速配置，到此，网络配置完成',
      target: '.step-six',
      placement: 'left-start',
    },
  ],
  stepIndex: 0,
  isSkip: sessionData,
  networkAddDialog: false,
};
const stepsContext: React.Context<{}> = createContext({});
export function useStepsContext(): stepsContext {
  return useContext(stepsContext) as stepsContext;
}
export const StepContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = React.useReducer((state: Steps, action: Action) => {
    switch (action.type) {
      case ACTION_TYPE.SET_STEPS:
        return {
          ...state,
          steps: action.payload,
        };
      case ACTION_TYPE.SET_SKIP:
        localStorage.setItem('isSkip', 'true');
        return {
          ...state,
          isSkip: action.payload,
        };
      case ACTION_TYPE.SET_NETWORK_ADD_DIALOG:
        return {
          ...state,
          networkAddDialog: action.payload,
        };
      case ACTION_TYPE.SET_STEP_INDEX:
        return {
          ...state,
          stepIndex: action.payload,
        };
      default:
        return state;
    }
  }, initialState);
  return (
    <stepsContext.Provider value={{ state, dispatch }}>
      {children}
    </stepsContext.Provider>
  );
};
