import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { NotFound404 } from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';

const App = () => (
  <div className={styles.app}>
    <Router>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </Router>
  </div>
);

export default App;
