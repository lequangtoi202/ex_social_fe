import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from 'firebase/auth';

import { auth } from '~/config/firebase';
import styles from '~/pages/Login/Login.module.scss';
import { API_URL } from '~/constants';
import { setError, setSuccess } from '~/redux/action';

const cx = classNames.bind(styles);
function ResetPassword() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const hideCursor = {
    textAlign: 'center',
  };
  const dispatch = useDispatch();
  const error = useSelector((state) => state.error);
  const success = useSelector((state) => state.success);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_URL}users/reset-password?token=${token}`)
        .then((response) => {})
        .catch((error) => {
          dispatch(setError('Token không hợp lệ'));
        });
    }
  }, [token]);

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
      dispatch(setError('Mật khẩu không trùng khớp'));
    }
    try {
      const response = await axios.post(API_URL + 'users/reset-password', null, {
        params: {
          token: token,
          password: password,
          confirmPassword: confirmPassword,
        },
      });
      updatePassword(auth.currentUser, password)
        .then((res) => {
          dispatch(setSuccess('Thành công'));
        })
        .catch((error) => {
          dispatch(setError('Update mật khẩu không thành công'));
        });
    } catch (error) {
      dispatch(setError('Update mật khẩu không thành công'));
    }
  };

  return (
    <div className={cx('formContainer')}>
      <div className={cx('formWrapper')}>
        <span className={cx('logo')}>Alma Social</span>
        <span className={cx('title')}>Reset password</span>
        {error && <div className={cx('alert-error')}>{error}</div>}
        {success && <div className={cx('alert-success')}>{success}</div>}
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

          <button>Reset password</button>
          <p style={hideCursor}>
            <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
