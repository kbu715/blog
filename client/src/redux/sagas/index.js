import {all, fork} from 'redux-saga/effects'
import axios from 'axios';
import authSaga from './authSaga';
import dotenv from 'dotenv';
import postSaga from './postSaga';
dotenv.config();

axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

export default function* rootSaga() { //function* : 여러값을 반환하는 최신 문법 함수
    yield all([fork(authSaga), fork(postSaga)]);
}