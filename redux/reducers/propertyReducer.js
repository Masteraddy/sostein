import {
	PROPERTY_ERR,
	ADD_PROPERTY,
	DELETE_PROPERTY,
	EDIT_PROPERTY,
	GET_PROPERTY,
	GET_PROPERTYS,
	GET_PROPERTIES,
} from '../actionTypes';

const authReducer = (state = { msg: null, error: null, property: {}, properties: [], propert: [] }, action) => {
	switch (action.type) {
		case ADD_PROPERTY:
			return { ...state, msg: action.payload };
		case GET_PROPERTYS:
			return { ...state, properties: action.payload };
		case GET_PROPERTIES:
			return { ...state, propert: action.payload };
		case GET_PROPERTY:
			return { ...state, property: action.payload };
		case DELETE_PROPERTY:
			return { ...state, properties: action.payload };
		case EDIT_PROPERTY:
			return { ...state, property: action.payload };
		case PROPERTY_ERR:
			return { ...state, error: action.payload };
		default:
			return state;
	}
};

export default authReducer;
