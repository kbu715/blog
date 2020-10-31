import axios from "axios";
import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import {
  CLEAR_ERROR_FAILURE,
  CLEAR_ERROR_REQUEST,
  CLEAR_ERROR_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  USER_LOADING_FAILURE,
  USER_LOADING_REQUEST,
  USER_LOADING_SUCCESS,
} from "../types";

////////////// Login

const loginUserAPI = (loginData) => { //서바와 통신을 하기 때문에 API라는 이름을 붙힌듯하다.
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




////////////// User Loading
//User Loading은 login과 매우 유사하지만 다른 점은 token만 있으면 loading 여부를 판단가능
const userLoadingAPI = (token) => { 
  console.log(token, "token");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if(token){
    config.headers["x-auth-token"] = token;
  }
  return axios.get("api/auth/user", config); 
};

function* userLoading(action) {
  try {
    console.log(action, "userLoading action");
    const result = yield call(userLoadingAPI, action.payload);
    console.log(result);
    yield put({
      type: USER_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: USER_LOADING_FAILURE,
      payload: e.reponse,
    });
  }
}

function* watchuserLoading() {
  yield takeEvery(USER_LOADING_REQUEST, userLoading); 
}



// Register

const registerUserAPI = (req) => {
  console.log(req, "req");

  return axios.post("api/user", req);
};

function* registerUser(action) {
  try {
    const result = yield call(registerUserAPI, action.payload);
    console.log(result, "RegisterUser Data");
    yield put({
      type: REGISTER_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: REGISTER_FAILURE,
      payload: e.response,
    });
  }
}

function* watchregisterUser() {
  yield takeEvery(REGISTER_REQUEST, registerUser);
}




// clear Error

function* clearError() {
  try {
    yield put({
      type: CLEAR_ERROR_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: CLEAR_ERROR_FAILURE,
    });
    console.error(e);
  }
}



function* watchclearError() {
  yield takeEvery(CLEAR_ERROR_REQUEST, clearError);
}


export default function* authSaga() {
  yield all([
    fork(watchLoginUser), //fork: 콕찝어서(?) watchLoginUser를
    fork(watchLogout),
    fork(watchuserLoading),
    fork(watchregisterUser),
    fork(watchclearError),
  ]);
}
