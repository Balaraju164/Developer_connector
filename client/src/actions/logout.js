import { LOG_OUT,CLEAR_PROFILE } from './types';

const logout = () => (dispatch) => {
  dispatch({
    type: LOG_OUT,
  });
  dispatch({
    type: CLEAR_PROFILE,
  });
};
export default logout;
