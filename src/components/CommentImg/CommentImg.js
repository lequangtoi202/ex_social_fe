import axios from 'axios';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Image from '../Image/Image';
import { API_URL } from '~/constants';
import styles from '../CommentBox/Comment.module.scss';
import { UtilsFunction } from '~/utils';

const cx = classNames.bind(styles);
function CommentImg({ userId }) {
  const [user, setUser] = useState({});
  const { handleShowError } = UtilsFunction();
  useEffect(() => {
    axios
      .get(API_URL + `users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => handleShowError('Đã có lỗi xảy ra!'));
  }, [userId]);
  return <Image src={user.avatarLink} className={cx('comment-user')} />;
}

CommentImg.propTypes = {
  userId: PropTypes.number,
};

export default CommentImg;
