import React, { useState } from 'react';
import { doLogin } from '../../features/user/userSlice';
import { useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { PASSWORD_MIN_LENGTH } from '../../constants/user';
import styles from './LoginPage.module.css';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [disableSaveStatus, setDisableSaveStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      await dispatch(
        doLogin({
          email,
          password,
          save: !disableSaveStatus,
        })
      ).unwrap();
      setShowSuccess(true);
      navigate('/', { replace: true });
    } catch (e) {
      setShowError(true);
      setLoading(false);
    }
  };

  return (
    <main className={styles.root} role="main">
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
    </main>
  );
}
