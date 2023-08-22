import axios from 'axios';
import { API_URL } from '~/constants';

export const search = async (q) => {
  try {
    const res = await axios.get(API_URL + 'users', {
      params: {
        name: q,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error.response.message);
  }
};
