import classNames from 'classnames/bind';
import Cookies from 'universal-cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './SurveyPost.module.scss';
import { API_URL } from '~/constants';
import { UtilsFunction } from '~/utils';

const cx = classNames.bind(styles);
function SurveyPost({ postId }) {
  const cookies = new Cookies();
  const { handleShowError } = UtilsFunction();
  const [surveyContent, setSurveyContent] = useState({});
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [questionOptionsMap, setQuestionOptionsMap] = useState({});
  const token = cookies.get('accessToken');

  useEffect(() => {
    axios
      .get(API_URL + `posts/${postId}/surveys`)
      .then((res) => {
        setSurveyContent(res.data);
        return res.data.id;
      })
      .then((surveyId) => {
        axios
          .get(API_URL + `surveys/${surveyId}/questions`, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
          .then((res) => {
            setSurveyQuestions(res.data);
          })
          .catch((err) => handleShowError('Đã xảy ra lỗi!'));
      })
      .catch((err) => handleShowError('Đã xảy ra lỗi!'));
  }, [postId]);

  useEffect(() => {
    const fetchQuestionOptions = async () => {
      const optionsMap = {};
      for (const question of surveyQuestions) {
        try {
          const response = await axios.get(API_URL + `questions/${question.id}/options`);
          optionsMap[question.id] = response.data;
        } catch (error) {
          handleShowError('Đã có lỗi xảy ra');
        }
      }
      setQuestionOptionsMap(optionsMap);
    };

    if (surveyQuestions.length > 0) {
      fetchQuestionOptions();
    }
  }, [surveyQuestions]);
  return (
    <div className={cx('survey-wrapper')}>
      <div className={cx('survey-title')}>{surveyContent.title}</div>
      <div className={cx('survey-description')}>Mô tả: {surveyContent.description}</div>
      {surveyQuestions.length > 0 &&
        surveyQuestions.map((question, index) => (
          <div key={question.id} className={cx('survey-question-outer')}>
            <span>Câu hỏi {index + 1}: </span>
            <span className={cx('survey-question')}>{question.content}</span>
            <div className={cx('survey-options')}>
              {questionOptionsMap[question.id]?.map((option, index) => (
                <>
                  <div className={cx('survey-option')}>
                    <input key={index} type="radio" name={`surveyOption_${question.id}`} value={option.content} />
                    <span>{option.content}</span>
                  </div>
                </>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default SurveyPost;
