import {all} from 'redux-saga/effects'

export default function* rootSaga() { //function* : 여러값을 반환하는 최신 문법 함수
    yield all([]);
}