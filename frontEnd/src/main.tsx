import ReactDOM from 'react-dom/client';
import Router from '@/route';
import AppContext from '@/contexts';
import 'virtual:svg-icons-register';
import './index.less';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppContext>
    <Router />
  </AppContext>
);
