import { actionTypes } from './action';

const initialState = {
  deletedSubComments: false,
  deletePosts: false,
  error: null,
  success: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DELETE_SUBCOMMENT:
      return {
        ...state,
        deletedSubComments: action.payload,
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.SUCCESS:
      return {
        ...state,
        success: action.payload,
      };
    case actionTypes.DELETE_POST:
      return {
        ...state,
        deletePosts: action.payload,
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case actionTypes.CLEAR_SUCCESS:
      return {
        ...state,
        success: null,
      };
    default:
      return state;
  }
};

export default reducer;
