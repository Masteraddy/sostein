// actions/authActions.js
import cookie from 'react-cookies';
import Router from 'next/router';
import { Message } from 'antd';
import fetch from 'isomorphic-unfetch';
import axios from 'axios';
// import feather from '@feathersjs/feathers';
// import client from '@feathersjs/rest-client';
// import auth from '@feathersjs/authentication-client';
import {
  AUTHENTICATE,
  DEAUTHENTICATE,
  REGISTER,
  USERINFO,
  AUTH_ERROR,
  USER_ID,
  URL,
} from '../actionTypes';
import { inProgress, notInProgress } from './uxActions';

// const restClient = rest(URL);
// const app = feathers();
// app.configure(restClient.fetch(fetch));

export const authenticate = (user) => (dispatch) => {
  // console.log(user);
  // dispatch(inProgress());
  user.strategy = 'local';
  axios
    .post(URL + '/api/auth', user)
    .then((response) => {
      // console.log('ok set cookie', response.data);
      setCookie('token', response.data.accessToken);
      setCookie('intd', response.data.users._id);
      Message.success('Sign complete. Taking you to your dashboard!').then(() =>
        Router.push('/dashboard'),
      );
      dispatch(notInProgress());
      dispatch({ type: USERINFO, payload: response.data.users });
      dispatch({ type: AUTHENTICATE, payload: response.data.accessToken });
    })
    .catch((err) => {
      //   console.log(err.response);
      Message.error(err.response.data.message);
      dispatch(notInProgress());
      return dispatch({ type: AUTH_ERROR, payload: err.response.data.message });
    });
};

export const deauthenticate = () => {
  return (dispatch) => {
    removeCookie('token');
    removeCookie('intd');
    Router.push('/signin');
    dispatch({ type: DEAUTHENTICATE });
  };
};

export const register = (user) => (dispatch) => {
  // console.log(user);
  // dispatch(inProgress());
  axios
    .post(URL + '/api/users', user)
    .then((response) => {
      // console.log('ok set cookie', response.status);
      //   setCookie('token', response.data.token);
      Message.success('Sign up complete. Loading sign in page!').then(() =>
        Router.push('/signin'),
      );
      dispatch(notInProgress());
      //   dispatch({ type: USERINFO, payload: response.data.user });
      //   dispatch({ type: AUTHENTICATE, payload: response.data.token });
      //   dispatch({ type: REGISTER, payload: response.data.token });
    })
    .catch((err) => {
      console.log(err.response.data);
      Message.error(err.response.data.message);
      dispatch(notInProgress());
      return dispatch({ type: AUTH_ERROR, payload: err.response.data.message });
    });
};

export const editProfile = (user, id) => (dispatch) => {
  const token = getCookie('token');

  dispatch(inProgress());

  axios
    .patch(`${URL}/api/users/${id}`, user, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    })
    .then((response) => {
      // console.log('ok set cookie', response.token);
      // console.log(response);
      if (response.data.success) {
        Message.success('Profile Updated');
        dispatch(notInProgress());
        return dispatch(getUser(token));
      }
      Message.error(response.data.message);
      dispatch(notInProgress());

      return;
      // .then(() => Router.push('/dashboard'));
    })
    .catch((err) => {
      console.log(err);
      dispatch(notInProgress());

      return Message.error(err.response.data.msg);
    });

  // console.log(user);
};

export const getUser = (token) => (dispatch) => {
  const id = getCookie('intd');
  if (!token) return null;
  axios
    .get(`${URL}/api/user/${id}`, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((response) => {
      // console.log(response.data);
      dispatch({ type: AUTHENTICATE, payload: token });
      dispatch({ type: USERINFO, payload: response.data });
      return { loaded: true };
    })
    .catch((err) => console.log(err.response.data));
};

export const getUserLocal = async (host, token, id) => {
  // console.log(token);
  if (!token) return null;
  const res = await fetch(`${URL}/api/user/${id}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `${token}`,
    },
  });
  const user = await res.json();
  // console.log(user);
  return user;
};

export const loadUser = async (username, users) => {
  const user = users.find((data) => data.username === username);
  return user;
};

/**
 * cookie helper methods
 */

export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.save(key, value, {
      path: '/',
    });
  }
};

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key);
  }
};

export const getCookie = (key, req) => {
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

const getCookieFromBrowser = (key) => {
  return cookie.load(key);
};

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split('=')[1];
};
