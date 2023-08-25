import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import classNames from 'classnames/bind';

import { auth } from '~/config/firebase';
import styles from './Login.module.scss';
import { API_URL } from '~/constants';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, setError } from '~/redux/action';

const cx = classNames.bind(styles);
const Login = () => {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const navigate = useNavigate();
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let email;
    if (emailRegex.test(formData.usernameOrEmail)) {
      email = formData.usernameOrEmail;
      try {
        const response = await axios.get(`${API_URL}users/byEmail?email=${email}`);

        if (response.statusCode === 500) {
          dispatch(setError('Email không tồn tại'));
          setTimeout(() => {
            dispatch(clearError());
          }, 3000);
        } else {
          const user = response.data;
          const loginRequest = {
            username: user.username,
            password: formData.password,
          };
          try {
            const res = await axios.post(API_URL + 'auth/login', JSON.stringify(loginRequest), {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const resToken = await res.data;
            const accessToken = resToken.accessToken;
            const refreshToken = resToken.refreshToken;
            document.cookie = `accessToken=${accessToken}; Path=/;`;
            document.cookie = `refreshToken=${refreshToken}; Path=/;`;
            dispatch(clearError());
            try {
              await signInWithEmailAndPassword(auth, user.email, formData.password);
              navigate('/');
            } catch (err) {
              dispatch(setError('Đăng nhập không thành công!'));
            }
          } catch (err) {
            if (err.response.status === 500) {
              dispatch(setError('Đăng nhập không thành công!'));
              setTimeout(() => {
                dispatch(clearError());
              }, 3000);
            }
            if (err.response.status === 400) {
              dispatch(setError(err.response.data));
              setTimeout(() => {
                dispatch(clearError());
              }, 3000);
            }
          }
        }
      } catch (err) {
        dispatch(setError('Email không tồn tại'));
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      }
    } else {
      email = formData.usernameOrEmail;
      try {
        const response = await axios.get(`${API_URL}users/byUsername?username=${email}`);
        if (response.status === 500) {
          dispatch(setError('Username không tồn tại'));
        } else {
          const user = response.data;
          const loginRequest = {
            username: user.username,
            password: formData.password,
          };

          try {
            const res = await axios.post(API_URL + 'auth/login', JSON.stringify(loginRequest), {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const resToken = await res.data;
            const accessToken = resToken.accessToken;
            const refreshToken = resToken.refreshToken;
            document.cookie = `accessToken=${accessToken}; Path=/;`;
            document.cookie = `refreshToken=${refreshToken}; Path=/;`;
            dispatch(clearError());

            // login trong firebase
            try {
              await signInWithEmailAndPassword(auth, user.email, formData.password);
              navigate('/');
            } catch (err) {
              dispatch(setError('Đăng nhập không thành công!'));
              setTimeout(() => {
                dispatch(clearError());
              }, 3000);
            }
          } catch (err) {
            if (err.response.status === 400) {
              dispatch(setError(err.response.data));
              setTimeout(() => {
                dispatch(clearError());
              }, 3000);
            }
            if (err.response.status === 500) {
              dispatch(setError('Đã có lỗi xảy ra!'));
              setTimeout(() => {
                dispatch(clearError());
              }, 3000);
            }
          }
        }
      } catch (err) {
        dispatch(setError('Username không đã tồn tại'));
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      }
    }
  };
  return (
    <>
      <div className={cx('formContainer')}>
        <div className={cx('formWrapper')}>
          <span className={cx('logo')}>Alma Social</span>
          <span className={cx('title')}>Login</span>
          {error && <div className={cx('alert-error')}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="username or email"
              name="usernameOrEmail"
              required
              onChange={handleChange}
            />
            <input type="password" placeholder="password" name="password" required onChange={handleChange} />
            <button>Sign in</button>
          </form>
          <p>
            <Link to="/forget-password">Forget password?</Link>
          </p>
          <p>
            You don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
