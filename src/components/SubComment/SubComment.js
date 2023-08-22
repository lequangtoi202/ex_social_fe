import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import styles from './SubComment.module.scss';
import { UserContext } from '~/auth/AuthContext';
import { API_URL } from '~/constants';
import { deleteSubComment } from '~/redux/action';
import CommentImg from '../CommentImg/CommentImg';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { UtilsFunction } from '~/utils';

const cx = classNames.bind(styles);
function SubComment({ subComment, postId }) {
  const cookies = new Cookies();
  const token = cookies.get('accessToken');
  const { currentUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const { handleShowError, handleShowSuccess } = UtilsFunction();

  const handleDeleteComment = (commentId) => {
    axios
      .delete(API_URL + `posts/${postId}/comments/${commentId}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        dispatch(deleteSubComment(true));
        handleShowSuccess('Xóa comment thành công');
      })
      .catch((err) => {
        handleShowError('Lấy dữ liệu thất bại!');
      });
  };

  return (
    <div className={cx('sub-comment-info-wrap')}>
      <CommentImg userId={subComment.userId} />

      <div className={cx('comment-part')}>
        <div className={cx('comment')}>{subComment.content}</div>
        <div className={cx('comment-interactions-wrapper')}>
          <div className={cx('interactions-action')}>
            <span>Thích</span>
          </div>
          <div className={cx('comment-action')}>
            <span>Phản hồi</span>
          </div>
          {currentUser.userId === subComment.userId && (
            <div className={cx('comment-action')} onClick={() => handleDeleteComment(subComment.id)}>
              <span>Xóa</span>
            </div>
          )}
          {formatDistanceToNow(new Date(subComment.timestamp), {
            addSuffix: true,
            locale: vi,
          })}
        </div>
      </div>
    </div>
  );
}

SubComment.propTypes = {
  subComment: PropTypes.object,
};

export default SubComment;
