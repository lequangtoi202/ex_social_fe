import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { vi } from 'date-fns/locale';

import { UserContext } from '~/auth/AuthContext';
import { API_URL } from '~/constants';
import styles from './Comment.module.scss';
import SubComment from '../SubComment/SubComment';
import { deleteSubComment } from '~/redux/action';
import CommentImg from '../CommentImg/CommentImg';
import { UtilsFunction } from '~/utils';

const cx = classNames.bind(styles);
function CommentBox({ post }) {
  const cookies = new Cookies();
  const token = cookies.get('accessToken');
  const dispatch = useDispatch();
  const { handleShowError, handleShowSuccess } = UtilsFunction();
  const deletedSubComments = useSelector((state) => state.deletedSubComments);
  const { currentUser } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [expandedComments, setExpandedComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [openReplyForms, setOpenReplyForms] = useState({});

  const visibleComments = comments.filter((comment) => comment.belongsComment === null);
  const hasParentComment = comments.filter((comment) => comment.belongsComment !== null);
  const commentsWithSubComments = visibleComments.map((comment) => {
    const subComments = hasParentComment.filter((subComment) => subComment.belongsComment === comment.id);
    return {
      ...comment,
      subComments,
    };
  });

  const toggleExpand = (commentId) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}posts/${post.id}/comments`)
      .then((response) => {
        setComments(response.data);
        dispatch(deleteSubComment(false));
      })
      .catch((error) => {
        handleShowError('Đã có lỗi xảy ra.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, deletedSubComments]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      const content = {
        content: newComment,
      };
      axios
        .post(`${API_URL}posts/${post.id}/comments`, JSON.stringify(content), {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setComments([...comments, response.data]);
        })
        .catch((error) => {
          handleShowError('Đã có lỗi xảy ra!');
        });
      setNewComment('');
    }
  };

  const handleReply = (commentId) => {
    setOpenReplyForms((prevOpenReplyForms) => ({
      ...prevOpenReplyForms,
      [commentId]: !prevOpenReplyForms[commentId],
    }));
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(API_URL + `posts/${post.id}/comments/${commentId}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        dispatch(deleteSubComment(true));
        handleShowSuccess('Thành công');
      })
      .catch((err) => {
        handleShowError('Đã xảy ra lỗi!');
      });
  };

  const handleReplyComment = (e, commentId) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      const content = {
        content: newComment,
      };
      axios
        .post(`${API_URL}posts/${post.id}/comments/${commentId}/comments`, JSON.stringify(content), {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setComments([...comments, response.data]);
        })
        .catch((error) => {
          handleShowError('Đã xảy ra lỗi!');
        });
      setNewComment('');
    }
  };

  return (
    <div className={cx('comment-box')}>
      <div className={cx('comment-list')}>
        {commentsWithSubComments.map((comment, index) => (
          <div key={index} className={cx('comment-info-wrap')}>
            <CommentImg userId={comment.userId} />
            <div className={cx('comment-part')}>
              <div className={cx('comment')}>{comment.content}</div>
              <div className={cx('comment-interactions-wrapper')}>
                <div className={cx('interactions-action')}>
                  <span>Thích</span>
                </div>
                <div className={cx('comment-action')} onClick={() => handleReply(comment.id)}>
                  <span>Phản hồi</span>
                </div>
                {comment.subComments.length > 0 && (
                  <span style={{ cursor: 'pointer' }} onClick={() => toggleExpand(comment.id)}>
                    {expandedComments.includes(comment.id) ? 'Ẩn bớt' : 'Xem thêm'}
                  </span>
                )}
                {(currentUser.userId === comment.userId || currentUser.userId === post.userId) && (
                  <div className={cx('comment-action')} onClick={() => handleDeleteComment(comment.id)}>
                    <span>Xóa</span>
                  </div>
                )}
                {formatDistanceToNow(new Date(comment.timestamp), {
                  addSuffix: true,
                  locale: vi,
                })}
              </div>
              {expandedComments.includes(comment.id) && (
                <div className={cx('sub-comments')}>
                  {comment.subComments.map((subComment, subIndex) => (
                    <SubComment key={subIndex} subComment={subComment} post={post} />
                  ))}
                </div>
              )}
              {openReplyForms[comment.id] && (
                <form className={cx('comment-form')} onSubmit={(e) => handleReplyComment(e, comment.id)}>
                  <input
                    type="text"
                    placeholder="Viết câu trả lời..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit">
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
      <form className={cx('comment-form')} onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Viết câu trả lời..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
}

CommentBox.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentBox;
