import axios from 'axios';
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

export const getItems = () => dispatch =>{
    dispatch(setItemsLoading());
    axios.get(`${API_BASE_URL}/api/items`)
    .then(res => 
        dispatch({
            type: GET_ITEMS,
            payload: res.data
        })
    )
};

export const addItem = item => dispatch => {
    axios.post(`${API_BASE_URL}/api/items`, item)
    .then(res => 
        dispatch({
            type: ADD_ITEM,
            payload: res.data
        })
    )
};  

export const deleteItem = id => dispatch => {
    axios.delete(`${API_BASE_URL}/api/items/${id}`).then(res =>
        dispatch({
            type: DELETE_ITEM,
            payload: id
        })
    );
};

export const setItemsLoading = () => {
    return{
        type: ITEMS_LOADING
    }
};