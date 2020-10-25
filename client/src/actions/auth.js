import axios from 'axios';
import { REGISTRATION_FAIL, REGISTRATION_SUCCESS } from './types';
import setAlert from './alert';
import loadUser from './loadUser';
//import setAuthToken from '../utils/xAuthtoken';

//LOAD_USER
// const loadUser = () => async (dispatch) => {
//   if (localStorage.token) {
//     setAuthToken(localStorage.token);
//   }

//   try {
//     const res = await axios.get('api/auth');
//     dispatch({
//       type: LOAD_SUCCESS,
//       payload: res.data,
//     });
//   } catch (err) {
//     dispatch({
//       type: LOAD_FAIL,
//     });
//   }
// };

//Register User
const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ name, email, password });
  //console.log(body);
  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTRATION_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }
    dispatch({
      type: REGISTRATION_FAIL,
    });
  }
};
export default register;
