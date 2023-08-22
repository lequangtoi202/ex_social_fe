import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import { API_URL } from '~/constants';
import { usePosts } from '~/context/PostContext';
import { UtilsFunction } from '~/utils';

function PostModal({ show, onHide, data = null }) {
  const cookies = new Cookies();
  const { handleShowError, handleShowSuccess } = UtilsFunction();
  const { addPost, setPosts } = usePosts();
  const [content, setContent] = useState('');
  const [disabled, setDisabled] = useState(true);
  const token = cookies.get('accessToken');

  useEffect(() => {
    if (!show) {
      resetContent();
    }
  }, [show]);

  const resetContent = () => {
    setContent('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data !== null) {
      try {
        const postRequest = {
          content: content,
          isSurvey: false,
          isLocked: false,
        };

        const res = await axios.put(API_URL + `posts/${data.id}`, JSON.stringify(postRequest), {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        });
        addPost(res.data);
        handleShowSuccess('Sửa bài đăng thành công');
        setContent('');
        onHide();
      } catch (err) {
        console.log(err);
        handleShowError('Sửa bài đăng không thành công.');
      }
    } else {
      try {
        const postRequest = {
          content: content,
          isSurvey: false,
          isLocked: false,
        };
        const res = await axios.post(API_URL + 'posts', JSON.stringify(postRequest), {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        });
        addPost(res.data);
        handleShowSuccess('Tạo bài đăng thành công');
        setContent('');
        onHide();
      } catch (err) {
        handleShowError('Tạo bài đăng không thành công.');
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.value !== '') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    setContent(e.target.value);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo bài viết</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <textarea
          onChange={handleChange}
          placeholder={data && data.content ? data.content : 'Bạn đang nghĩ gì?'}
          value={content}
          style={{ height: '200px', width: '100%', padding: '10px', outline: 'none', fontSize: '18px' }}
        ></textarea>

        <Button
          disabled={disabled}
          variant="primary"
          large={true}
          style={{ width: '100%', padding: '16px 50px', backgroundColor: 'rgb(29, 155, 240)', color: 'white' }}
        >
          Đăng
        </Button>
      </form>
    </Modal>
  );
}

PostModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  data: PropTypes.object,
};

export default PostModal;
