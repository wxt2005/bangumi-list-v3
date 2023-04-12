import React, { useState } from 'react';
import { signup } from '../../models/user.model';
import { useRouter } from 'next/router';
import { PASSWORD_MIN_LENGTH } from '../../constants/user';
import Container from '../../components/common/Container';
import Head from 'next/head';
import styles from './index.module.css';

export default function SignupPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const handleEmailChange: React.FormEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.currentTarget.value);
  };
  const handlePasswordChange: React.FormEventHandler<HTMLInputElement> = (
    e
  ) => {
    setPassword(e.currentTarget.value);
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password);
      setShowSuccess(true);
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch (e) {
      setShowError(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>注册 | 番组放送</title>
      </Head>
      <Container className={styles.root}>
        <h2 className={styles.title}>注册</h2>
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
            minLength={PASSWORD_MIN_LENGTH}
            onInput={handlePasswordChange}
            placeholder=" "
          />
          <p className={styles.hint}>
            最短{PASSWORD_MIN_LENGTH}位的半角英文或者数字
          </p>
          {showError ? <p className={styles.error}>注册失败 :p</p> : null}
          {showSuccess ? (
            <p className={styles.success}>注册成功，跳转到登录界面...</p>
          ) : null}
          <button type="submit" className={styles.submit} disabled={loading}>
            注册
          </button>
        </form>
      </Container>
    </>
  );
}
