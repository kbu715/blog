import axios from 'axios';
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from '../types';


// Login 

const loginUserAPI = (loginData) => {
    console.log(loginData);
    const config = { //postman에서 보던것!!!
        headers: {
            "Content-Type": "application/json"
        }
    }
    return axios.post('api/auth', loginData, config);
}

function* loginUser(action){
    try{
        const result = yield call(loginUserAPI, action.payload);
        console.log(result);
        yield put({
            type:LOGIN_SUCCESS,
            payload: result.data
        })
    }catch(e){
        yield put({
            type: LOGIN_FAILURE,
            payload: e.reponse
        })
    }
}

function* watchLoginUser(){ // 매번 보고 있어라 LOGIN_REQUEST를 감시해라.
    yield takeEvery(LOGIN_REQUEST, loginUser) // LOGIN_REQUEST가 들어오면 loginUser를 불러와라
}


/* ### 이 세개가 리덕스사가의 하나의 패턴으로 작용한다. */

export default function* authSaga(){
    yield all([
        fork(watchLoginUser) //fork: 콕찝어서(?) watchLoginUser를
    ])
}