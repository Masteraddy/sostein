// import cookie from 'react-cookies';
// import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import axios from 'axios';
import { Message } from 'antd';
import {
  LOCATION_ERR,
  ADD_LOCATION,
  DELETE_LOCATION,
  EDIT_LOCATION,
  GET_LOCATIONS,
  GET_LOCATION,
  URL,
} from '../actionTypes';
import { getCookie } from './authActions';
import {
  locationOpenAndClose,
  locationOpenAndClose2,
  inProgress,
  notInProgress,
} from '../actions';

export const getLocations = () => (dispatch) => {
  dispatch(inProgress());
  axios
    .get(`${URL}/api/location`)
    .then((response) => {
      let final = response.data.result.filter((data) => {
        data.key = data._id;
        return data;
      });
      // Message.success('Sign complete. Taking you to your dashboard!').then(() => Router.push('/dashboard'));
      dispatch({ type: GET_LOCATIONS, payload: final });
      // console.log(response.data);
      dispatch(notInProgress());
    })
    .catch((err) => {
      Message.error(err.response.data.message);
      dispatch(notInProgress());
      return dispatch({
        type: LOCATION_ERR,
        payload: err.response.data.message,
      });
    });
};

export const getLocationLocal = async (host) => {
  try {
    const res = await fetch(`${URL}/api/location`);
    const data = await res.json();
    // console.log(data[0]);

    let final = data.result.map((dt) => {
      dt.key = dt._id;
      return dt;
    });
    return final;
    // return [];
  } catch (error) {
    console.log(error.message);
    // Message.error(error.message);
    return [];
  }
};

export const getLocation = (id) => (dispatch) => {
  dispatch(inProgress());
  axios
    .get(`${URL}/api/location/${id}`)
    .then((response) => {
      if (response.data.msg) {
        Message.error(response.data.msg);
        dispatch(notInProgress());
        return dispatch({ type: LOCATION_ERR, payload: response.data.msg });
      }
      // Message.success('Sign complete. Taking you to your dashboard!').then(() => Router.push('/dashboard'));
      dispatch(notInProgress());
      dispatch({ type: GET_LOCATION, payload: response.data.result });
    })
    .catch((err) => {
      console.log(err);
      Message.error(err.response.data.msg);
      return dispatch({ type: LOCATION_ERR, payload: err.response.data.msg });
    });
};

export const deleteLocation = (id) => (dispatch) => {
  const token = getCookie('token');
  dispatch(inProgress());
  // console.log(id);
  axios
    .delete(`${URL}/api/location/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    })
    .then((result) => {
      if (result.success) {
        Message.success('Location is deleted successfully');
        dispatch(notInProgress());
        return dispatch(getLocations());
      }
      Message.error('Error while deleting the location');
      return dispatch(notInProgress());
    })
    .catch((err) => {
      Message.error('Unable to delete this location');
      dispatch(notInProgress());
      return console.log(err.response.data);
    });
};

export const addLocation = (body) => (dispatch) => {
  const token = getCookie('token');
  dispatch(inProgress());
  // console.log(token, body);
  axios
    .post(`${URL}/api/location`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    })
    .then((result) => {
      if (result.data.success) {
        Message.success('Location is added successfully');
        // dispatch({ type: ADD_LOCATION, payload: result.data });
        dispatch(locationOpenAndClose());
        dispatch(notInProgress());
        return dispatch(getLocations());
      }
      // console.log(result);
      Message.error('Error while adding location');
      return dispatch(notInProgress());
    })
    .catch((err) => {
      // console.log(err);
      Message.error('Unable to add this location');
      dispatch(notInProgress());
      return console.log(err.response.data);
    });
};

export const editLocation = (body, id) => (dispatch) => {
  const token = getCookie('token');
  dispatch(inProgress());
  axios
    .patch(`${URL}/api/location/${id}`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    })
    .then((result) => {
      if (result.data.success) {
        Message.success('Location status is changed successfully');
        dispatch({ type: EDIT_LOCATION, payload: {} });
        dispatch(locationOpenAndClose2());
        dispatch(notInProgress());
        return dispatch(getLocations());
      }
      // console.log(result);
      Message.error('Error while updating the location');
      return dispatch(notInProgress());
    })
    .catch((err) => {
      Message.error('Unable to change this location status');
      dispatch(notInProgress());
      return console.log(err.response.data);
    });
};
