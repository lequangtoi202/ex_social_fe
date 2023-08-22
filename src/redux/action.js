export const actionTypes = {
  DELETE_SUBCOMMENT: 'DELETE_SUBCOMMENT',
  DELETE_POST: 'DELETE_POST',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_SUCCESS: 'CLEAR_SUCCESS',
  SUCCESS: 'SUCCESS',
};

export const deleteSubComment = (isDeleted) => ({
  type: actionTypes.DELETE_SUBCOMMENT,
  payload: isDeleted,
});

export const deletePost = (isDeleted) => ({
  type: actionTypes.DELETE_POST,
  payload: isDeleted,
});

export const setSuccess = (isSuccess) => ({
  type: actionTypes.SUCCESS,
  payload: isSuccess,
});

export const clearSuccess = () => ({
  type: actionTypes.CLEAR_SUCCESS,
});

export const setError = (error) => ({
  type: actionTypes.SET_ERROR,
  payload: error,
});

export const clearError = () => ({
  type: actionTypes.CLEAR_ERROR,
});
