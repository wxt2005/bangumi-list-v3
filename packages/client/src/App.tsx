import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchAllSites } from './features/bangumi/siteSlice';
import { fetchUserInfo, selectIsLogin } from './features/user/userSlice';
import {
  readCommonPreferenceFromStorage,
  fetchCommonPreference,
} from './features/preference/commonPreferenceSlice';
import {
  readBangumiPreferenceFromStorage,
  fetchBangumiPreference,
} from './features/preference/bangumiPreferenceSlice';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import OnAirPage from './components/pages/OnAirPage';
import ArchivePage from './components/pages/ArchivePage';
import ArchiveModal from './components/modals/ArchiveModal';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import MePage from './components/pages/MePage';
import ConfigModal from './components/modals/ConfigModal';
import api from './utils/api';
import './styles/App.css';

function App(): JSX.Element {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const state = location.state as { backgroundLocation?: Location };
  const isLogin = useAppSelector(selectIsLogin);

  useEffect(() => {
    dispatch(fetchAllSites());
    if (api.hasCredential()) {
      dispatch(fetchUserInfo());
      dispatch(fetchCommonPreference());
      dispatch(fetchBangumiPreference());
    } else {
      dispatch(readCommonPreferenceFromStorage());
      dispatch(readBangumiPreferenceFromStorage());
    }
  }, []);
  useEffect(() => {
    if (isLogin) {
      dispatch(fetchUserInfo());
      dispatch(fetchCommonPreference());
      dispatch(fetchBangumiPreference());
    }
  }, [isLogin]);

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<OnAirPage />} />
          <Route path="archive">
            <Route index element={<ArchiveModal />} />
            <Route path=":season" element={<ArchivePage />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="me" element={<MePage />} />
          <Route path="config" element={<ConfigModal />} />
        </Route>
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/archive" element={<ArchiveModal />} />
          <Route path="config" element={<ConfigModal />} />
        </Routes>
      )}
    </>
  );
}

export default App;
