import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';

import { API_URL } from '~/constants';
import { UtilsFunction } from '~/utils';

function CountInteraction({ type, postId }) {
  const { handleShowError } = UtilsFunction();
  const [amount, setAmount] = useState(0);
  switch (type) {
    case 'like':
      axios
        .get(API_URL + `posts/${postId}/count-react`)
        .then((res) => setAmount(res.data))
        .catch((err) => handleShowError('Đã có lỗi xảy ra'));
      break;
    case 'comment':
      axios
        .get(API_URL + `posts/${postId}/count-comment`)
        .then((res) => setAmount(res.data))
        .catch((err) => handleShowError('Đã có lỗi xảy ra'));
      break;
    case 'share':
      axios
        .get(API_URL + `posts/${postId}/count-share`)
        .then((res) => setAmount(res.data))
        .catch((err) => handleShowError('Đã có lỗi xảy ra'));
      break;
    default:
      // eslint-disable-next-line no-use-before-define
      handleShowError('Đã có lỗi xảy ra');
  }

  return <span> {amount} </span>;
}

CountInteraction.propTypes = {
  type: PropTypes.string,
  postId: PropTypes.number,
};

export default CountInteraction;
