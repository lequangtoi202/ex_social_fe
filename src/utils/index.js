import { useDispatch } from 'react-redux';
import { TIME_SHOW_OUT } from '~/constants';
import { clearError, clearSuccess, setError, setSuccess } from '~/redux/action';

export const UtilsFunction = () => {
  const dispatch = useDispatch();

  const handleShowSuccess = (message) => {
    dispatch(setSuccess(message));

    setTimeout(() => {
      dispatch(clearSuccess());
    }, TIME_SHOW_OUT);
  };

  const handleShowError = (message) => {
    dispatch(setError(message));

    setTimeout(() => {
      dispatch(clearError());
    }, TIME_SHOW_OUT);
  };

  return {
    handleShowSuccess,
    handleShowError,
  };
};
