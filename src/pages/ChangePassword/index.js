import React, { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import { updatePassword } from 'firebase/auth';

import { auth } from '~/config/firebase';
import styles from '~/pages/Login/Login.module.scss';
import { API_URL } from '~/constants';
import Cookies from 'universal-cookie';
import { UtilsFunction } from '~/utils/';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

const cx = classNames.bind(styles);
function ChangePassword() {
  const cookies = new Cookies();
  const token = cookies.get('accessToken');
  const { handleShowError, handleShowSuccess } = UtilsFunction();
  const error = useSelector((state) => state.error);
  const success = useSelector((state) => state.success);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
    if (e.target.name === 'confirmPassword') {
      setConfirmPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      handleShowError('Mật khẩu không trùng khớp');
    } else {
      const passwordRequest = {
        password,
        confirmPassword,
      };
      try {
        const response = await axios.post(API_URL + 'users/change-password', JSON.stringify(passwordRequest), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        updatePassword(auth.currentUser, password)
          .then((res) => {
            handleShowSuccess('Thành công');
            setPassword('');
            setConfirmPassword('');
          })
          .catch((error) => {
            handleShowError('Update mật khẩu thất bại');
          });
      } catch (error) {
        handleShowError('Update mật khẩu thất bại');
      }
    }
  };

  return (
    <>
      {error && (
        <div className={cx('error')}>
          <AiOutlineCloseCircle />
          {error}
        </div>
      )}
      {success && (
        <div className={cx('success')}>
          <AiOutlineCheckCircle />
          {success}
        </div>
      )}
      <div className={cx('formContainer')}>
        <div className={cx('formWrapper')}>
          <span className={cx('logo')}>Alma Social</span>
          <span className={cx('title')}>Change password</span>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="password"
              value={password}
              name="password"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="confirm password"
              onChange={handleChange}
              value={confirmPassword}
              required
              name="confirmPassword"
            />

            <button>Update password</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
