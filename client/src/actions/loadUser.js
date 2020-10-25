import axios from 'axios';
import { LOAD_SUCCESS, LOAD_FAIL } from './types';
import setAuthToken from '../utils/xAuthtoken';

const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('api/auth');
    dispatch({
      type: LOAD_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LOAD_FAIL,
    });
  }
};

export default loadUser;
