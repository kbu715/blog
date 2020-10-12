import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
})

export default createRootReducer;


//리듀서에 들어와서 상태값을 어떻게 관리해줄지 정해준다!!!