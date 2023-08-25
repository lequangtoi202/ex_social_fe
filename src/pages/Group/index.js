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
import { useParams } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import { faCommentAlt, faShareFromSquare, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import axios from 'axios';

import styles from './Group.module.scss';
import UserInfo from '~/components/UserInfo/UserInfo';
import { UserContext } from '~/auth/AuthContext';
import { API_URL } from '~/constants';
import CommentBox from '~/components/CommentBox/CommentBox';
import PostModal from '~/components/PostModal/PostModal';
import CountInteraction from '~/components/CountInteraction/CountInteraction';
import { usePosts } from '~/context/PostContext';
import Image from '~/components/Image/Image';
import noImage from '~/assets/images/no-image.png';
import Button from '~/components/Button/Button';
import { deletePost } from '~/redux/action';
import SurveyModal from '~/components/SurveyModal/SurveyModal';
import SurveyPost from '~/layouts/components/SurveyPost/SurveyPost';
import AddMember from '~/components/AddMember/AddMember';
import { UtilsFunction } from '~/utils';

const cx = classNames.bind(styles);
function Group() {
  const reaction = ['LIKE', 'LOVE', 'SAD', 'WOW', 'ANGRY'];
  const { addPost } = usePosts();
  const { currentUser } = useContext(UserContext);
  const error = useSelector((state) => state.error);
  const success = useSelector((state) => state.success);
  const isDeletePost = useSelector((state) => state.deletePosts);
  const dispatch = useDispatch();
  const { handleShowError, handleShowSuccess } = UtilsFunction();
  const cookies = new Cookies();
  const token = cookies.get('accessToken');
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [showCommentBoxes, setShowCommentBoxes] = useState({});
  const [post, setPost] = useState({});
  const [postReactions, setPostReactions] = useState([]);
  const [group, setGroup] = useState({});
  const [hoveredPostId, setHoveredPostId] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(5);
  const containerRef = useRef(null);
  const [isHidden, setIsHidden] = useState(true);
  const [showTimeout, setShowTimeout] = useState(null);
  const [show, setShow] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [reactionValue, setReactionValue] = useState(reaction[0]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isUploadSuccess, setIsUploadSuccess] = useState('');

  const handleShowSurvey = () => setShowSurvey(true);
  const handleCloseSurvey = () => setShowSurvey(false);
  const handleShowAddMember = () => setShowAddMember(true);
  const handleCloseAddMember = () => setShowAddMember(false);

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
      .get(API_URL + `groups/${id}`)
      .then((response) => {
        setGroup(response.data);
      })
      .catch((error) => {
        handleShowError('Đã xảy ra lỗi.');
      });
  }, [isUploadSuccess]);

  useEffect(() => {
    axios
      .get(API_URL + 'posts', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        setPosts(response.data);
        dispatch(deletePost(false));
      })
      .catch((error) => {
        handleShowError('Đã xảy ra lỗi.');
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
        handleShowError('Sửa bài đăng thất bại!');
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
        handleShowSuccess('Xóa bài đăng thành công');
        dispatch(deletePost(true));
      })
      .catch((error) => {
        handleShowError('Xóa bài đăng thất bại!');
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
        handleShowError('Không thể khóa bài đăng');
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
        handleShowError('Không thể mở khóa bài đăng');
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
      .catch((err) => handleShowError('Đã có lỗi xảy ra!'));
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
        handleShowError('React không thành công!');
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
        handleShowError('Share không thành công!');
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
        setIsUploadSuccess(res.data);
        handleShowSuccess('Upload ảnh thành công');
      })
      .catch((err) => {
        setIsUploadSuccess(err.message);
        handleShowError('Upload ảnh không thành công!');
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
        <div className={cx('group-wrapper')}>
          <div className={cx('group-header-outer')}>
            <div className={cx('group-header')}>
              <div className={cx('group-background')} style={{ backgroundImage: `url(${noImage})` }}>
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
              <div className={cx('group-avatar')}>
                <Image src={noImage} className={cx('user-avatar')} alt=" no image" />
                <div className={cx('user-name')}>{group.groupName}</div>
              </div>
            </div>
          </div>
          <div className={cx('group-add-surveys')}>
            {currentUser.userId === group.creatorId && (
              <>
                <Button primary small={true} onClick={handleShowAddMember}>
                  Thêm thành viên
                </Button>
                <Button primary small={true} onClick={handleShowSurvey}>
                  Tạo khảo sát
                </Button>
              </>
            )}
          </div>
          <AddMember show={showAddMember} onHide={handleCloseAddMember} groupId={group.id} />
          <SurveyModal show={showSurvey} onHide={handleCloseSurvey} />

          {selectedPost && !post.isSurvey && <PostModal show={show} onHide={handleClose} data={post} />}
          {selectedPost && post.isSurvey && <SurveyModal show={show} onHide={handleClose} data={post} />}
          {!selectedPost && <PostModal show={show} onHide={handleClose} />}
          <div className={cx('group-body-outer')}>
            {posts.slice(0, visiblePosts).map((post, index) => (
              <div key={index} className={cx('group-posts')}>
                <div className={cx('group-post-wrapper')}>
                  <div className={cx('group-user-info')}>
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
                  {!post.isLocked && showCommentBoxes[post.id] && <CommentBox post={post} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Group;
