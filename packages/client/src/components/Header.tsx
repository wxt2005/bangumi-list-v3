import React from 'react';
import BaseContainer from './base/BaseContainer';
import { SUBMIT_PROBLEM_LINK } from '../constants/links';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  selectIsLogin,
  selectUserEmail,
  doLogout,
} from '../features/user/userSlice';
import UserIcon from '../images/user.svg';
import LogoutIcon from '../images/logout.svg';
import styles from './Header.module.css';

export default function Header(): JSX.Element {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isLogin = useAppSelector(selectIsLogin);
  const userEmail = useAppSelector(selectUserEmail);
  const handleLogout = async () => {
    await dispatch(doLogout());
    window.location.href = '/';
  };

  return (
    <header className={styles.header}>
      <BaseContainer className={styles.container}>
        <h1 className={styles.title}>
          <Link to="/">番组放送</Link>
        </h1>
        <nav aria-label="站点导航" className={styles.navMenu}>
          <ul className={styles.navMenuList}>
            <li>
              <Link to="/archive" state={{ backgroundLocation: location }}>
                历史数据
              </Link>
            </li>
            <li>
              <a
                href={SUBMIT_PROBLEM_LINK}
                title="如果发现数据错误或者其它问题，请联系站长"
              >
                提交问题
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-label="用户导航" className={styles.navUser}>
          {isLogin ? (
            <ul className={styles.navUserList}>
              <li>
                <Link to="/me" className={styles.button}>
                  <UserIcon className={styles.icon} />
                  <span className={styles.iconText}>{userEmail}</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className={styles.button}
                  onClick={handleLogout}
                >
                  <LogoutIcon className={styles.icon} />
                  <span className={styles.iconText}>登出</span>
                </button>
              </li>
            </ul>
          ) : (
            <ul className={styles.navUserList}>
              <li>
                <Link to="/login">登录</Link>
              </li>
              <li>
                <Link to="/signup">注册</Link>
              </li>
            </ul>
          )}
        </nav>
      </BaseContainer>
    </header>
  );
}
