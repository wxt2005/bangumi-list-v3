import React from 'react';
import Link from 'next/link';
import { SUBMIT_PROBLEM_LINK } from '../../constants/links';
import { useUser, useUserDispatch } from '../../contexts/userContext';
import UserIcon from '../../images/user.svg';
import LogoutIcon from '../../images/logout.svg';
import { logout } from '../../models/user.model';
import Container from './Container';
import styles from './Header.module.css';

export default function Header(): JSX.Element {
  const { isLogin, email: userEmail } = useUser();
  const userDispatch = useUserDispatch();

  const handleLogout = async () => {
    await logout();
    userDispatch({ type: 'LOGOUT' });
    window.location.href = '/'; // Use hard reload
  };

  return (
    <header className={styles.header} role="banner">
      <Container className={styles.container}>
        <h1 className={styles.title}>
          <Link href="/">番组放送</Link>
        </h1>
        <nav aria-label="站点导航" className={styles.navMenu}>
          <ul className={styles.navMenuList}>
            <li>
              <Link href="/archive">历史数据</Link>
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
                <Link href="/me" className={styles.button}>
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
                <Link href="/login">登录</Link>
              </li>
              <li>
                <Link href="/signup">注册</Link>
              </li>
            </ul>
          )}
        </nav>
      </Container>
    </header>
  );
}
