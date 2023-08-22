/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faShareFromSquare, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import {
  faAngry,
  faEllipsisV,
  faHeart,
  faSadTear,
  faSurprise,
  faThumbsUp as thumbsUpSolid,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import Cookies from 'universal-cookie';
import CommentBox from '~/components/CommentBox/CommentBox';
import { UserContext } from '~/auth/AuthContext';
import Image from '~/components/Image/Image';
import styles from './Home.module.scss';
import { API_URL } from '~/constants';
import UserInfo from '~/components/UserInfo/UserInfo';
import { usePosts } from '~/context/PostContext';
import PostModal from '~/components/PostModal/PostModal';
import CountInteraction from '~/components/CountInteraction/CountInteraction';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '~/redux/action';
import { UtilsFunction } from '~/utils';

const cx = classNames.bind(styles);
function Home() {
  const reaction = ['LIKE', 'LOVE', 'SAD', 'WOW', 'ANGRY'];
  const { handleShowError, handleShowSuccess } = UtilsFunction();
  const { addPost } = usePosts();
  const { currentUser } = useContext(UserContext);
  const [showCommentBoxes, setShowCommentBoxes] = useState({});
  const error = useSelector((state) => state.error);
  const success = useSelector((state) => state.success);
  const isDeletePost = useSelector((state) => state.deletePosts);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({});
  const [hoveredPostId, setHoveredPostId] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(5);
  const containerRef = useRef(null);
  const [isHidden, setIsHidden] = useState(true);
  const [showTimeout, setShowTimeout] = useState(null);
  const [show, setShow] = useState(false);
  const [postReactions, setPostReactions] = useState([]);
  const [reactionValue, setReactionValue] = useState(reaction[0]);
  const [selectedPost, setSelectedPost] = useState(null);
  const cookies = new Cookies();
  const token = cookies.get('accessToken');

  const handleClose = () => {
    setShow(false);
    setSelectedPost(null);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    axios
      .get(API_URL + 'posts')
      .then((response) => {
        setPosts(response.data);
        dispatch(deletePost(false));
      })
      .catch((error) => {
        handleShowError('Đã có lỗi xảy ra');
      });
  }, [addPost, isDeletePost]);

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
      .catch((err) => handleShowError('Đã có lỗi xảy ra'));
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
        handleShowSuccess('Thành công');
      })
      .catch((error) => {
        handleShowError('Share không thành công!');
      });
  };

  const hasReactionForPost = (postId) => {
    return postReactions.some((reaction) => reaction.id === postId && reaction.isReact);
  };

  const handleEdit = (postId) => {
    axios
      .get(
        API_URL + `posts/${postId}`,
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
        handleShowError('Chỉnh sửa không thành công!');
      });
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
        handleShowSuccess('Thành công');
      })
      .catch((error) => {
        handleShowError('Xóa bài đăng không thành công!');
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
        handleShowError('Không thể khóa post này!');
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
        handleShowError('Không thể mở khóa post này!');
      });
  };
  console.log(currentUser);

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
        <div className={cx('wrapper')}>
          <div className={cx('post-area')}>
            <div className={cx('post-outer')}>
              <Image src={currentUser.photoURL} className={cx('user-avatar')} alt="aa" />
            </div>
            <div className={cx('post-create')} onClick={handleShow}>
              <span className={cx('input-placeholder')}>Bạn đang nghĩ gì?</span>
            </div>
          </div>
          {selectedPost && <PostModal show={show} onHide={handleClose} data={post} />}
          {!selectedPost && <PostModal show={show} onHide={handleClose} />}

          {posts.slice(0, visiblePosts).map((post, index) => (
            <div key={index} className={cx('posts')}>
              {!post.isSurvey && (
                <div className={cx('post-wrapper')}>
                  <div className={cx('user-info')}>
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
                    <div className={cx('content')}>{post.content}</div>
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
                  {post.isLocked && showCommentBoxes[post.id] && (
                    <div style={{ marginLeft: '20px' }}>Bình luận đã bị khóa</div>
                  )}
                  {!post.isLocked && showCommentBoxes[post.id] && <CommentBox postId={post.id} />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
