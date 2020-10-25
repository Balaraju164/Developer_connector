import {
  REGISTRATION_SUCCESS,
  REGISTRATION_FAIL,
  LOAD_FAIL,
  LOAD_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOG_OUT,
  ACCOUNT_DELETED
} from '../actions/types';

const initialstate = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialstate, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_SUCCESS:
      return { ...state, isAuthenticated: true, loading: false, user: payload };
    //return { ...state, token: null, isAuthenticated: false, loading: false };
    case REGISTRATION_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    case REGISTRATION_FAIL:
    case LOAD_FAIL:
    case LOGIN_FAIL:
    case LOG_OUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem('token');
      return { ...state, token: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
}
