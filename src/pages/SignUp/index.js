import React, { useState } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

import { auth, db, storage } from '~/config/firebase';
import Add from '~/assets/images/addAvatar.png';
import styles from './SignUp.module.scss';
import { API_URL } from '~/constants';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, setError, setSuccess } from '~/redux/action';

const cx = classNames.bind(styles);
const SignUp = () => {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('user');
  const [emailExists, setEmailExists] = useState(false);
  const [userRegistered, setUserRegistered] = useState({});
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    username: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    userType: 'user',
    file: null,
  });
  const phoneRegex = /\b\d{10}\b/g;
  const navigate = useNavigate();

  const handleUserTypeChange = (event) => {
    const newUserType = event.target.value;
    setUserType(newUserType);

    setFormData((prevFormData) => ({
      ...prevFormData,
      userType: newUserType,
    }));
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;

    if (name === 'email') {
      try {
        const response = await axios(`${API_URL}users/exist-email?email=${value}`);
        const data = await response.data;
        if (data) {
          setEmailExists(data);
          dispatch(setError('Email đã tồn tại.'));
        } else {
          dispatch(clearError());
        }
      } catch (err) {
        dispatch(setError('Đã xảy ra lỗi!'));
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      }
    }

    if (name === 'phone') {
      if (!phoneRegex.test(value)) {
        dispatch(setError('Số điện thoại không hợp lệ!'));
      } else {
        dispatch(clearError());
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      file: selectedFile,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (formData.userType === 'alumni') {
      const alumni = {
        displayName: formData.displayName,
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        studentId: formData.studentId,
      };
      const alumniRequest = new FormData();
      alumniRequest.append('alumni', JSON.stringify(alumni));
      alumniRequest.append('avatar', formData.file);

      try {
        const response = await axios.post(API_URL + 'auth/register/alumni', alumniRequest, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setUserRegistered(response.data);

        const user = response.data;
        try {
          //Create user
          const password = formData.userType !== 'lecturer' ? formData.password : 'ou@123';
          const res = await createUserWithEmailAndPassword(auth, formData.email, password);

          //Create a unique image name
          const date = new Date().getTime();
          const storageRef = ref(storage, `${formData.displayName + date}`);
          await uploadBytesResumable(storageRef, formData.file).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
              try {
                await updateProfile(res.user, {
                  displayName: formData.displayName,
                  photoURL: downloadURL,
                });

                await setDoc(doc(db, 'users', res.user.uid), {
                  uid: res.user.uid,
                  userId: user.userId,
                  displayName: formData.displayName,
                  email: formData.email,
                  photoURL: downloadURL,
                });

                await setDoc(doc(db, 'userChats', res.user.uid), {});
                navigate('/login');
              } catch (err) {
                dispatch(setError('Đăng ký thất bại!'));
                setTimeout(() => {
                  dispatch(clearError());
                }, 3000);
                setLoading(false);
              }
            });
          });
        } catch (err) {
          dispatch(setError('Đăng ký thất bại'));
          setTimeout(() => {
            dispatch(clearError());
          }, 3000);
          setLoading(false);
        }
      } catch (error) {
        dispatch(setError('Đăng ký thất bại'));
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      }
    } else {
      const lecturer = {
        displayName: formData.displayName,
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        phone: formData.phone,
      };
      const lecturerRequest = new FormData();
      lecturerRequest.append('lecturer', JSON.stringify(lecturer));
      lecturerRequest.append('avatar', formData.file);
      try {
        const response = await axios.post(API_URL + 'auth/register/lecturer', lecturerRequest, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setUserRegistered(response.data);

        const lecRequest = {
          username: formData.username,
          email: formData.email,
        };
        try {
          const res = await axios.post(API_URL + 'users/lecturer/provide-account', JSON.stringify(lecRequest), {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          dispatch(setSuccess(res.data));
        } catch (err) {
          dispatch(setError(err.response.data));
          setTimeout(() => {
            dispatch(clearError());
          }, 3000);
        }

        const user = response.data;
        try {
          const password = formData.userType !== 'lecturer' ? formData.password : 'ou@123';
          const res = await createUserWithEmailAndPassword(auth, formData.email, password);

          const date = new Date().getTime();
          const storageRef = ref(storage, `${formData.displayName + date}`);
          await uploadBytesResumable(storageRef, formData.file).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
              try {
                await updateProfile(res.user, {
                  displayName: formData.displayName,
                  photoURL: downloadURL,
                });
                await setDoc(doc(db, 'users', res.user.uid), {
                  uid: res.user.uid,
                  userId: user.userId,
                  displayName: formData.displayName,
                  email: formData.email,
                  photoURL: downloadURL,
                });

                await setDoc(doc(db, 'userChats', res.user.uid), {});
                navigate('/login');
              } catch (err) {
                dispatch(setError('Đăng ký thất bại'));
                setTimeout(() => {
                  dispatch(clearError());
                }, 3000);
                setLoading(false);
              }
            });
          });
        } catch (err) {
          dispatch(setError('Đăng ký thất bại'));
          setTimeout(() => {
            dispatch(clearError());
          }, 3000);
          setLoading(false);
        }
      } catch (error) {
        dispatch(setError('Đăng ký thất bại!'));
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      }
    }
  };

  return (
    <div className={cx('formContainer')}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className={cx('formWrapper')}>
          <span className={cx('logo')}>Alma Social</span>
          <span className={cx('title')}>Sign up</span>
          {error && <div className={cx('alert-error')}>{error}</div>}
          <input
            required
            type="text"
            name="displayName"
            placeholder="display name"
            value={formData.displayName}
            onChange={handleChange}
          />
          <input
            required
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            required
            type="text"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            required
            type="text"
            name="fullName"
            placeholder="full name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <input required type="text" name="phone" placeholder="phone" value={formData.phone} onChange={handleChange} />
          <div className={cx('radio-group')}>
            <input
              type="radio"
              id="alumni"
              name="typeSignup"
              value="alumni"
              checked={userType === 'alumni'}
              onChange={handleUserTypeChange}
            />
            <label htmlFor="alumni">Alumni</label>
            <input
              type="radio"
              id="lecturer"
              name="typeSignup"
              value="lecturer"
              checked={userType === 'lecturer'}
              onChange={handleUserTypeChange}
            />
            <label htmlFor="lecturer">Lecturer</label>
          </div>
          {userType === 'alumni' && (
            <div id="optionalPart" style={{ display: userType === 'alumni' ? 'block' : 'none' }}>
              <input
                required
                type="text"
                placeholder="student id"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
              />
              <input
                required
                type="password"
                placeholder="password"
                name="password"
                minLength="6"
                value={formData.password}
                onChange={handleChange}
              />
              <input
                required
                type="password"
                name="confirmPassword"
                minLength="6"
                placeholder="confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}
          <input required style={{ display: 'none' }} type="file" id="file" name="file" onChange={handleFileChange} />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && 'Uploading and compressing the image please wait...'}
          <p>
            You do have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
