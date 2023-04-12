import React, { useState } from 'react';
import { useUserDispatch } from '../../contexts/userContext';
import { login, getUser } from '../../models/user.model';
import Container from '../../components/common/Container';
import Head from 'next/head';
import styles from './index.module.css';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [disableSaveStatus, setDisableSaveStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const userDispatch = useUserDispatch();
  const handleEmailChange: React.FormEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.currentTarget.value);
  };
  const handlePasswordChange: React.FormEventHandler<HTMLInputElement> = (
    e
  ) => {
    setPassword(e.currentTarget.value);
  };
  const handleDisableSaveStatusChange: React.FormEventHandler<
    HTMLInputElement
  > = (e) => {
    setDisableSaveStatus(e.currentTarget.checked);
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, !disableSaveStatus);
      const { id: loggedInId, email: loggedInEmail } = await getUser();
      userDispatch({ type: 'LOGIN', id: loggedInId, email: loggedInEmail });
      setShowSuccess(true);
      window.location.replace('/'); // Use hard reload
    } catch (e) {
      setShowError(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>登录 | 番组放送</title>
      </Head>
      <Container className={styles.root}>
        <h2 className={styles.title}>登录</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="email">邮箱</label>
          <input
            id="email"
            name="email"
            className={styles.input}
            type="email"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
            required
            value={email}
            onInput={handleEmailChange}
            placeholder=" "
          />
          <label htmlFor="password">密码</label>
          <input
            id="password"
            name="password"
            className={styles.input}
            type="password"
            value={password}
            autoComplete="new-password"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
            required
            onInput={handlePasswordChange}
            placeholder=" "
          />
          <div className={styles.saveBox}>
            <input
              id="saveLoginStatus"
              type="checkbox"
              checked={disableSaveStatus}
              onChange={handleDisableSaveStatusChange}
            />
            <label htmlFor="saveLoginStatus">不保存登录状态</label>
          </div>
          {showError ? <p className={styles.error}>登录失败 XD</p> : null}
          {showSuccess ? (
            <p className={styles.success}>登录成功，跳转中...</p>
          ) : null}
          <button type="submit" className={styles.submit} disabled={loading}>
            登录
          </button>
        </form>
      </Container>
    </>
  );
}
