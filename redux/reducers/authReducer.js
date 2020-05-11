import {
  AUTHENTICATE,
  DEAUTHENTICATE,
  REGISTER,
  USERINFO,
  AUTH_ERROR,
  USERSINFO,
  EDITUSERINFO,
  USER_ID,
} from '../actionTypes';

const authReducer = (
  state = { token: null, error: null, edit: {}, user: {}, users: [], id: null },
  action,
) => {
  switch (action.type) {
    case AUTHENTICATE:
      return { ...state, token: action.payload };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    case REGISTER:
      return { ...state, token: action.payload };
    case DEAUTHENTICATE:
      return { token: null, user: {} };
    case USERINFO:
      return { ...state, user: action.payload };
    case USER_ID:
      return { ...state, id: action.payload };
    case USERSINFO:
      return { ...state, users: action.payload };
    case EDITUSERINFO:
      return { ...state, edit: action.payload };
    default:
      return state;
  }
};

export default authReducer;
