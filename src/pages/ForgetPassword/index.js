import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from '~/pages/Login/Login.module.scss';
import { API_URL } from '~/constants';
import { clearError, setError } from '~/redux/action';

const cx = classNames.bind(styles);
function ForgetPassword() {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const handleChange = (e) => {
    if (!emailRegex.test(e.target.value)) {
      dispatch(setError('Email không hợp lệ'));
    } else {
      dispatch(clearError());
    }
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`${API_URL}users/forgot-password?email=${email}`);
      dispatch(clearError());
      setEmail('');
    } catch (err) {
      dispatch(setError('Yêu cầu reset password không thành công!'));
      setEmail('');
    }
  };

  return (
    <div className={cx('formContainer')}>
      <div className={cx('formWrapper')}>
        <span className={cx('logo')}>Alma Social</span>
        <span className={cx('title')}>Forget password</span>
        {error && <div className={cx('alert-error')}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Nhập email" value={email} name="email" required onChange={handleChange} />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
