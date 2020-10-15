import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history), //향후에 history를 사용한 connectRouter를 router를 통해 불러온다.
})// reducer를 이런식으로 명명하여 사용한다.

export default createRootReducer;


//Reducer에 들어와서 상태값을 어떻게 관리해줄지 정해준다!!!