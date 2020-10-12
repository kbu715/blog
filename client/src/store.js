const { routerMiddleware } = require("connected-react-router");
const { compose } = require("redux");

import {createStore, compose, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {createBrowserHistory} from 'history'
import {routerMiddleware} from 'connected-react-router'

import createRootReducer from './redux/reducers/index'
import rootSaga from './redux/sagas'

export const history = createBrowserHistory()

const sagaMiddleware = createSagaMiddleware()

const initialState = {};

const middlewares = [sagaMiddleware, routerMiddleware(history)];
const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__; 
//devtools:크롬같은데서 리덕스로 개발을 할 때 어떻게 상태가 진행되는지 볼수 있게 해주는 도구

const composeEnhancer =  
    process.env.NODE_ENV === "production" ? compose : devtools || compose;
//배포할때는 devtools를 안보이게 해줘야한다.
const store = createStore(
    createRootReducer(history),
    initialState, //웹의 모든 초기값을 담고 있다.
    composeEnhancer(applyMiddleware(...middlewares))
)
sagaMiddleware.run(rootSaga)

export default store;