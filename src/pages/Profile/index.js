/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngry,
  faCameraAlt,
  faEllipsisV,
  faHeart,
  faSadTear,
  faSurprise,
  faThumbsUp as thumbsUpSolid,
} from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Tippy from '@tippyjs/react';
import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useRef, useState } from 'react';
import { faCommentAlt, faShareFromSquare, faThumbsUp } from '@fortawesome/free-regular-svg-icons';

import styles from './Profile.module.scss';
import CountInteraction from '~/components/CountInteraction/CountInteraction';
import UserInfo from '~/components/UserInfo/UserInfo';
import { UserContext } from '~/auth/AuthContext';
import { API_URL } from '~/constants';
import CommentBox from '~/components/CommentBox/CommentBox';
import PostModal from '~/components/PostModal/PostModal';
import { usePosts } from '~/context/PostContext';
import Image from '~/components/Image/Image';
import { deletePost } from '~/redux/action';
import { UtilsFunction } from '~/utils';
import SurveyPost from '~/layouts/components/SurveyPost/SurveyPost';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

const cx = classNames.bind(styles);
function Profile() {
  const cookies = new Cookies();
  const token = cookies.get('accessToken');
  const reaction = ['LIKE', 'LOVE', 'SAD', 'WOW', 'ANGRY'];
  const error = useSelector((state) => state.error);
  const success = useSelector((state) => state.success);
  const isDeletePost = useSelector((state) => state.deletePosts);
  const dispatch = useDispatch();
  const { handleShowError, handleShowSuccess } = UtilsFunction();
  const containerRef = useRef(null);
  const { addPost } = usePosts();
  const { currentUser } = useContext(UserContext);
  const [isUploadSuccess, setIsUploadSuccess] = useState('');
  const [reactionValue, setReactionValue] = useState(reaction[0]);
  const [postReactions, setPostReactions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showCommentBoxes, setShowCommentBoxes] = useState({});
  const [post, setPost] = useState({});
  const [me, setMe] = useState({});
  const [hoveredPostId, setHoveredPostId] = useState(null);
  const [showTimeout, setShowTimeout] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [isHidden, setIsHidden] = useState(true);
  const [show, setShow] = useState(false);

  const hideIt = () => {
    setHoveredPostId(null);
    clearTimeout(showTimeout);
    setIsHidden(!isHidden);
  };

  const showIt = (postId) => {
    clearTimeout(showTimeout);
    setShowTimeout(
      setTimeout(() => {
        setHoveredPostId(postId);
        setIsHidden(!isHidden);
      }, 300),
    );
  };

  useEffect(() => {
    axios
      .get(API_URL + 'users/me', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        setMe(response.data);
      })
      .catch((error) => {
        handleShowError('Đã có lỗi xảy ra');
      });
  }, [isUploadSuccess]);

  useEffect(() => {
    axios
      .get(API_URL + 'me/posts', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        setPosts(response.data);
        dispatch(deletePost(false));
      })
      .catch((error) => {
        handleShowError('Đã có lỗi xảy ra');
      });
  }, [addPost, isDeletePost]);

  const handleEdit = (postId) => {
    axios
      .get(
        `${API_URL}posts/${postId}`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((response) => {
        setPost(response.data);
        setShow(true);
        setSelectedPost(postId);
      })
      .catch((error) => {
        handleShowError('Không thể chỉnh sửa bài post');
      });
  };

  const handleClose = () => {
    setShow(false);
    setSelectedPost(null);
  };

  const handleDelete = (postId) => {
    axios
      .delete(API_URL + `posts/${postId}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        const updatedPosts = posts.map((post) => post);
        setPosts(updatedPosts);
        dispatch(deletePost(true));
        handleShowSuccess('Xóa bài đăng thành công');
      })
      .catch((error) => {
        handleShowError('Không thể xóa bài post');
      });
  };

  const handleLockComment = (postId) => {
    axios
      .post(
        API_URL + `posts/${postId}/lock`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((response) => {
        const updatedPosts = posts.map((post) => (post.id === postId ? { ...post, isLocked: true } : post));
        setPosts(updatedPosts);
        handleShowSuccess('Khóa bài đăng thành công');
      })
      .catch((error) => {
        handleShowError('Không thể khóa bài post');
      });
  };

  const handleUnLockComment = (postId) => {
    axios
      .post(
        API_URL + `posts/${postId}/unlock`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((response) => {
        const updatedPosts = posts.map((post) => (post.id === postId ? { ...post, isLocked: false } : post));
        setPosts(updatedPosts);
        handleShowSuccess('Mở khóa bài đăng thành công');
      })
      .catch((error) => {
        handleShowError('Không thể mở khóa bài post');
      });
  };

  useEffect(() => {
    axios
      .get(API_URL + 'posts/users/interaction', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        const postsInteraction = res.data;
        postsInteraction.forEach((p) => {
          const postObj = {
            id: p.postId,
            userId: p.userId,
            isReact: true,
          };
          postReactions.push(postObj);
        });

        const uniquePostReactions = postReactions.filter(
          (reaction, index, self) => self.findIndex((r) => r.id === reaction.id) === index,
        );

        setPostReactions(uniquePostReactions);
      })
      .catch((err) => handleShowError('Server đang bị lỗi'));
  }, [posts]);

  const handleScroll = () => {
    if (containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight) {
      setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 5);
    }
  };

  const handleCommentClick = (postId) => {
    setShowCommentBoxes((prevShowCommentBoxes) => ({
      ...prevShowCommentBoxes,
      [postId]: !prevShowCommentBoxes[postId],
    }));
  };

  const handleReactionClick = (reactionId, postId) => {
    setReactionValue(reactionId);
    const formData = new FormData();
    formData.append('action', reactionValue);
    axios
      .post(API_URL + `interact/${postId}`, formData, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const newReaction = {
          postId: response.data.postId,
          userId: response.data.userId,
          isReact: true,
        };

        const existingReactionIndex = postReactions.findIndex((reaction) => reaction.postId === newReaction.postId);

        if (existingReactionIndex !== -1) {
          const updatedReactions = postReactions.map((reaction, index) =>
            index === existingReactionIndex ? newReaction : reaction,
          );
          setPostReactions(updatedReactions);
        } else {
          setPostReactions((prevReactions) => [...prevReactions, newReaction]);
        }
        handleShowSuccess('React bài đăng thành công');
      })
      .catch((error) => {
        handleShowError('Bạn đã tương tác với post này');
      });
  };

  const handleShareClick = (postId) => {
    axios
      .post(
        API_URL + `posts/${postId}/share`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then((response) => {
        const updatedPosts = posts.map((post) => post);
        setPosts(updatedPosts);
        handleShowSuccess('Share bài đăng thành công');
      })
      .catch((error) => {
        handleShowError('Share bài đăng không thành công');
      });
  };

  const hasReactionForPost = (postId) => {
    return postReactions.some((reaction) => reaction.id === postId && reaction.isReact);
  };

  const handleBackgroundUpload = (e) => {
    const formData = new FormData();
    formData.append('bgImage', e.target.files[0]);
    axios
      .post(API_URL + 'users/upload', formData, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        handleShowSuccess('Upload ảnh nền thành công');
        setIsUploadSuccess(res.data);
      })
      .catch((err) => {
        setIsUploadSuccess(err.message);
        handleShowError('Upload hình ảnh thất bại');
      });
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
      <div ref={containerRef} style={{ maxHeight: '500px', overflowY: 'scroll' }} onScroll={handleScroll}>
        <div className={cx('profile-wrapper')}>
          <div className={cx('profile-header-outer')}>
            <div className={cx('profile-header')}>
              <div className={cx('profile-background')} style={{ backgroundImage: `url(${me.backgroundImage})` }}>
                <label htmlFor="background-upload" className={cx('upload-label')}>
                  <FontAwesomeIcon icon={faCameraAlt} />
                  Chỉnh sửa ảnh bìa
                </label>
                <input
                  type="file"
                  id="background-upload"
                  hidden
                  accept="image/*"
                  className={cx('upload-input')}
                  onChange={handleBackgroundUpload}
                />
              </div>
              <div className={cx('profile-avatar')}>
                <Image src={me.avatarLink} className={cx('user-avatar')} alt=" no image" />
                <div className={cx('user-name')}>{me.displayName}</div>
              </div>
            </div>
          </div>
          {selectedPost && <PostModal show={show} onHide={handleClose} data={post} />}
          {!selectedPost && <PostModal show={show} onHide={handleClose} />}
          <div className={cx('profile-body-outer')}>
            {posts.slice(0, visiblePosts).map((post, index) => (
              <div key={index} className={cx('profile-posts')}>
                <div className={cx('profile-post-wrapper')}>
                  <div className={cx('profile-user-info')}>
                    <div className={cx('user-info-area')}>
                      <UserInfo userId={post.userId} timestamp={post.timestamp} />
                    </div>
                    <Tippy
                      placement="bottom-end"
                      content={
                        <div className={cx('tooltip-interactive')}>
                          {currentUser.userId === post.userId && (
                            <>
                              <div onClick={() => handleEdit(post.id)}>Chỉnh sửa</div>
                              {post.isLocked && (
                                <div onClick={() => handleUnLockComment(post.id)}>Mở khóa bình luận</div>
                              )}
                              {!post.isLocked && <div onClick={() => handleLockComment(post.id)}>Khóa bình luận</div>}
                              <div onClick={() => handleDelete(post.id)}>Xóa</div>
                            </>
                          )}
                        </div>
                      }
                      interactive={true}
                      trigger="click"
                    >
                      <div className={cx('post-function')}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </div>
                    </Tippy>
                  </div>
                  <div className={cx('content-wrapper')}>
                    {!post.isSurvey && <div className={cx('content')}>{post.content}</div>}
                    {post.isSurvey && <SurveyPost key={index} postId={post.id} />}
                  </div>
                  <div className={cx('interaction-wrapper')}>
                    <div className={cx('interactions-count')}>
                      <FontAwesomeIcon icon={faThumbsUp} />
                      <CountInteraction type={'like'} postId={post.id} />
                    </div>
                    <div className={cx('group-interactions')}>
                      <div className={cx('comments-count')} onClick={() => handleCommentClick(post.id)}>
                        <CountInteraction type={'comment'} postId={post.id} />
                        <FontAwesomeIcon icon={faCommentAlt} />
                      </div>
                      <div className={cx('share-count')}>
                        <CountInteraction type={'share'} postId={post.id} />
                        <FontAwesomeIcon icon={faShareFromSquare} />
                      </div>
                    </div>
                  </div>
                  <div className={cx('line')}></div>
                  <div className={cx('interaction-action-wrapper')}>
                    <div
                      className={cx('reaction-container')}
                      onMouseLeave={() => {
                        hideIt();
                      }}
                    >
                      <div className={cx('button-squad', { showIt: hoveredPostId === post.id })}>
                        <span
                          type="button"
                          className="btn btn-primary btn-circle btn-lg"
                          onClick={() => handleReactionClick(reaction[0], post.id)}
                        >
                          <FontAwesomeIcon icon={thumbsUpSolid} />
                        </span>
                        <span
                          type="button"
                          className="btn btn-danger btn-circle btn-lg"
                          onClick={() => handleReactionClick(reaction[1], post.id)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </span>
                        <span
                          type="button"
                          className="btn btn-info btn-circle btn-lg"
                          onClick={() => handleReactionClick(reaction[2], post.id)}
                        >
                          <FontAwesomeIcon icon={faSadTear} />
                        </span>
                        <span
                          type="button"
                          className="btn btn-warning btn-circle btn-lg"
                          onClick={() => handleReactionClick(reaction[3], post.id)}
                        >
                          <FontAwesomeIcon icon={faSurprise} />
                        </span>
                        <span
                          type="button"
                          className="btn btn-danger btn-circle btn-lg"
                          onClick={() => handleReactionClick(reaction[4], post.id)}
                        >
                          <FontAwesomeIcon icon={faAngry} />
                        </span>
                      </div>
                      <div
                        className={cx('interactions-action', { 'blue-reaction-post': hasReactionForPost(post.id) })}
                        onMouseEnter={() => showIt(post.id)}
                        tabIndex={0}
                        role="button"
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>Thích</span>
                      </div>
                    </div>
                    <div className={cx('comment-action')} onClick={() => handleCommentClick(post.id)}>
                      <FontAwesomeIcon icon={faCommentAlt} />
                      <span>Bình luận</span>
                    </div>
                    <div className={cx('share-action')} onClick={() => handleShareClick(post.id)}>
                      <FontAwesomeIcon icon={faShareFromSquare} />
                      <span>Chia sẻ</span>
                    </div>
                  </div>
                  {post.isLocked && showCommentBoxes[post.id] && <div>Bình luận đã bị khóa</div>}
                  {!post.isLocked && showCommentBoxes[post.id] && <CommentBox postId={post.id} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
