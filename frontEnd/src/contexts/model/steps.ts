import  {  Step } from 'react-joyride';
interface MyStep extends Step {
}
export interface Steps {
  steps: MyStep[],
  configNetSteps: MyStep[],
  openNetSteps: MyStep[],
  lastConfigNetSteps: MyStep[],
  isSkip: boolean,
  stepIndex: number,
  networkAddDialog: boolean,
}