import axios from "axios";
import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
} from "../types";

////////////// Login

const loginUserAPI = (loginData) => {
  console.log(loginData);
  const config = {
    //postman에서 설정 해줬던 것과 같다.
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post("api/auth", loginData, config); //loginData: 로그인 데이터,  config: 설정
};

function* loginUser(action) {
  try {
    const result = yield call(loginUserAPI, action.payload);
    console.log(result);
    yield put({
      type: LOGIN_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: LOGIN_FAILURE,
      payload: e.reponse,
    });
  }
}

function* watchLoginUser() {
  // 매번 보고 있어라 LOGIN_REQUEST를 감시해라.
  yield takeEvery(LOGIN_REQUEST, loginUser); // LOGIN_REQUEST가 들어오면 loginUser를 불러와라
}

/* ### 이 세개가 리덕스사가의 하나의 패턴으로 작용한다. */



////////Logout

function* logout(action) {
  try {
    yield put({
      type: LOGOUT_SUCCESS
    });
  } catch (e) {
    yield put({
      type: LOGOUT_FAILURE,
    });
    console.log(e);
  }
}

function* watchLogout() {
  yield takeEvery(LOGOUT_REQUEST, logout); //LOGOUT_REQUEST가 있으면 logout 함수를 발동시킨다.
}

export default function* authSaga() {
  yield all([
    fork(watchLoginUser), //fork: 콕찝어서(?) watchLoginUser를
    fork(watchLogout),
  ]);
}
