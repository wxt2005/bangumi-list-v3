import React, { useState } from 'react';
import { selectUserEmail, updateUserInfo } from '../../features/user/userSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { PASSWORD_MIN_LENGTH } from '../../constants/user';
import { useNavigate } from 'react-router-dom';
import styles from './MePage.module.css';

export default function LoginPage(): JSX.Element {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userEmail = useAppSelector(selectUserEmail);

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
      await dispatch(
        updateUserInfo({
          oldPassword,
          newPassword,
        })
      ).unwrap();
      setShowSuccess(true);
      navigate('/');
    } catch (e) {
      setShowError(true);
      setLoading(false);
    }
  };

  return (
    <main className={styles.root}>
      <h2 className={styles.title}>用户中心</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="email">邮箱</label>
        <input disabled className={styles.input} value={userEmail} />
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
        />
        {showError ? <p className={styles.error}>保存失败 XD</p> : null}
        {showSuccess ? (
          <p className={styles.success}>保存成功，跳转中...</p>
        ) : null}
        <button type="submit" className={styles.submit} disabled={loading}>
          保存
        </button>
      </form>
    </main>
  );
}
