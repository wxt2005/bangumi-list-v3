import React, { useState } from 'react';
import { PASSWORD_MIN_LENGTH } from '../../constants/user';
import { useUser } from '../../contexts/userContext';
import { updateUser } from '../../models/user.model';
import { useRouter } from 'next/router';
import Container from '../../components/common/Container';
import Head from 'next/head';
import styles from './index.module.css';

export default function LoginPage(): JSX.Element {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const { email: userEmail } = useUser();
  const router = useRouter();

  const handleOldPasswordChange: React.FormEventHandler<HTMLInputElement> = (
    e
  ) => {
    setOldPassword(e.currentTarget.value);
  };
  const handleNewPasswordChange: React.FormEventHandler<HTMLInputElement> = (
    e
  ) => {
    setNewPassword(e.currentTarget.value);
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser({
        oldPassword,
        newPassword,
      });
      setShowSuccess(true);
      router.push('/');
    } catch (e) {
      setShowError(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>用户中心 | 番组放送</title>
      </Head>
      <Container className={styles.root}>
        <h2 className={styles.title}>用户中心</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="email">邮箱</label>
          <input
            id="email"
            disabled
            className={styles.input}
            value={userEmail || ''}
          />
          <label htmlFor="oldPassword">原密码</label>
          <input
            id="oldPassword"
            name="oldPassword"
            className={styles.input}
            type="password"
            value={oldPassword}
            autoComplete="current-password"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
            required
            minLength={PASSWORD_MIN_LENGTH}
            onInput={handleOldPasswordChange}
            placeholder=" "
          />
          <label htmlFor="newPassword">新密码</label>
          <input
            id="newPassword"
            name="newPassword"
            className={styles.input}
            type="password"
            value={newPassword}
            autoComplete="new-password"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
            required
            minLength={PASSWORD_MIN_LENGTH}
            onInput={handleNewPasswordChange}
            placeholder=" "
          />
          {showError ? <p className={styles.error}>保存失败 XD</p> : null}
          {showSuccess ? (
            <p className={styles.success}>保存成功，跳转中...</p>
          ) : null}
          <button type="submit" className={styles.submit} disabled={loading}>
            保存
          </button>
        </form>
      </Container>
    </>
  );
}
