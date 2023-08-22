import classNames from 'classnames/bind';
import styles from './SurveyModal.module.scss';
import Button from '../Button/Button';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '~/constants';
import { usePosts } from '~/context/PostContext';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import { UtilsFunction } from '~/utils';

const cx = classNames.bind(styles);
function SurveyModal({ show, onHide, data = null }) {
  const cookies = new Cookies();
  const { handleShowError, handleShowSuccess } = UtilsFunction();
  const { addPost, setPosts } = usePosts();
  const [contentSurvey, setContentSurvey] = useState({
    type: 'TRAINING_PROGRAMS',
    description: '',
    title: '',
  });
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    content: '',
  });
  const [currentOptions, setCurrentOptions] = useState([]);
  const [newOption, setNewOption] = useState({
    content: '',
  });
  const token = cookies.get('accessToken');
  const surveyTypes = [
    {
      value: 'TRAINING_PROGRAMS',
      name: 'Trainning programs',
    },
    {
      value: 'EXTERNAL_RECRUITMENT_NEEDS',
      name: 'External recruitment needs',
    },
    {
      value: 'INCOME',
      name: 'Income',
    },
    {
      value: 'EMPLOYMENT_STATUS',
      name: 'Employment status',
    },
  ];

  const addNewQuestion = () => {
    if (currentQuestion.content !== '' && currentOptions.length > 0) {
      const newQuestion = {
        question: currentQuestion,
        options: currentOptions,
      };
      setSurveyQuestions([...surveyQuestions, newQuestion]);
      setCurrentQuestion({ content: '' });
      setCurrentOptions([]);
    }
  };

  const addNewOption = () => {
    if (newOption.content !== '') {
      setCurrentOptions([...currentOptions, { content: newOption.content }]);
      setNewOption({ content: '' });
    }
  };

  useEffect(() => {
    if (!show) {
      resetContent();
    }
  }, [show]);

  const resetContent = () => {
    setContentSurvey({
      type: 'TRAINING_PROGRAMS',
      description: '',
      title: '',
    });
    setNewOption({ content: '' });
    setCurrentQuestion({ content: '' });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contentSurvey.title === '') {
      handleShowError('Vui lòng nhập đầy đủ thông tin');
      return;
    } else if (contentSurvey.description === '') {
      handleShowError('Vui lòng nhập đầy đủ thông tin');
      return;
    } else {
      try {
        const defaultPostSurvey = {
          content: 'Survey',
          isSurvey: true,
        };
        const surveyReq = {
          title: contentSurvey.title,
          description: contentSurvey.description,
          type: contentSurvey.type,
        };
        const createPost = await axios.post(API_URL + `posts`, JSON.stringify(defaultPostSurvey), {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        });
        const post = await createPost.data;

        const createSurvey = await axios.post(API_URL + `posts/${post.id}/surveys`, JSON.stringify(surveyReq), {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        });
        const survey = createSurvey.data;
        for (const sq of surveyQuestions) {
          const optionQuestionRequest = {
            question: sq.question,
            options: sq.options,
          };

          const createQuestionResponse = await axios.post(
            API_URL + `surveys/${survey.id}/questions`,
            JSON.stringify(optionQuestionRequest),
            {
              headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
              },
            },
          );
          const questionSaved = createQuestionResponse.data;
        }
        addPost(post);
        handleShowSuccess('Tạo khảo sát thành công');
      } catch (err) {
        handleShowError('Tạo khảo sát thất bại!');
      }
    }
  };

  const handleChangeSurveyData = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setContentSurvey({ ...contentSurvey, title: value });
    }
    if (name === 'description') {
      setContentSurvey({ ...contentSurvey, description: value });
    }
    if (name === 'type') {
      setContentSurvey({ ...contentSurvey, type: value });
    }
  };
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo khảo sát</Modal.Title>
      </Modal.Header>
      <div>
        <div className={cx('survey-wrapper')}>
          <span className={cx('survey-title')}>Tiêu đề: </span>
          <input
            type="text"
            name="title"
            placeholder="Nhập tiêu đề..."
            value={contentSurvey.title}
            onChange={(e) => handleChangeSurveyData(e)}
          />
        </div>
        <div className={cx('survey-wrapper')}>
          <span className={cx('survey-type')}>Loại: </span>
          <select onChange={(e) => handleChangeSurveyData(e)} value={contentSurvey.type}>
            {surveyTypes.map((s, index) => (
              <option key={index} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className={cx('survey-wrapper')}>
          <span className={cx('survey-description')}>Mô tả: </span>
          <input
            type="text"
            name="description"
            placeholder="Nhập mô tả..."
            value={contentSurvey.description}
            onChange={(e) => handleChangeSurveyData(e)}
          />
        </div>
        {surveyQuestions.map((questionObj, questionIndex) => (
          <div key={questionIndex} className={cx('question-wrapper')}>
            <h4 className={cx('question-sequence')}>Câu hỏi {questionIndex + 1}:</h4>
            <p className={cx('question-content')}>{questionObj.question.content}</p>
            <div className={cx('options-wrapper')}>
              {questionObj.options.map((option, optionIndex) => (
                <div key={optionIndex} className={cx('options-outer')}>
                  <input
                    type="radio"
                    name={`surveyOptions_${questionIndex}`}
                    value={option.content}
                    style={{ marginRight: '8px' }}
                  />
                  <span>{option.content}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className={cx('question-wrapper')}>
          <span className={cx('question-sequence')}>Câu hỏi mới:</span>
          <input
            onChange={(e) => setCurrentQuestion({ content: e.target.value })}
            placeholder="Nhập câu hỏi..."
            value={currentQuestion.content}
          />
          <div>
            {currentOptions.map((option, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" value={option.content} style={{ marginRight: '8px' }} />
                <span>{option.content}</span>
              </div>
            ))}
          </div>
          <div className={cx('response-wrapper')}>
            <span className={cx('response-sequence')}>Lựa chọn:</span>
            <input
              type="text"
              placeholder="Nhập lựa chọn..."
              value={newOption.content}
              onChange={(e) => setNewOption({ content: e.target.value })}
            />
            <Button
              variant="primary"
              onClick={addNewOption}
              small={true}
              style={{ backgroundColor: 'rgb(29, 155, 240)', color: 'white' }}
            >
              Thêm lựa chọn
            </Button>
          </div>
        </div>
        <div className={cx('btn-add-question')}>
          <Button
            variant="primary"
            onClick={addNewQuestion}
            large={true}
            style={{ backgroundColor: 'rgb(29, 155, 240)', color: 'white' }}
          >
            Thêm câu hỏi
          </Button>
        </div>
        <div className={cx('btn-add-submit')}>
          <Button
            onClick={handleSubmit}
            large={true}
            style={{ width: '100%', padding: '16px 50px', backgroundColor: 'rgb(219 147 6)', color: 'white' }}
          >
            Hoàn tất
          </Button>
        </div>
      </div>
    </Modal>
  );
}

SurveyModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
};

export default SurveyModal;
