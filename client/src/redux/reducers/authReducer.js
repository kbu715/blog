import { CLEAR_ERROR_FAILURE, CLEAR_ERROR_REQUEST, CLEAR_ERROR_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS } from '../types'

const initialState = {
    token : localStorage.getItem('token'),
    isAuthenticated : null,
    isLoading : false,
    user : "",
    userId : "",
    userName : "",
    userRole : "",
    errorMsg : "",
    successMsg : ""
}

const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOGIN_REQUEST:
        case LOGOUT_REQUEST:
            return {
                ...state,
                errorMsg: "",
                isLoading: true,
            }
        case LOGIN_SUCCESS:
            localStorage.setItem("token", action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
                userId: action.payload.user.id,
                userRole: action.payload.user.role,
                errorMsg: "",
            }
        case LOGIN_FAILURE:
        case LOGOUT_FAILURE:
            localStorage.removeItem("token")
            return {
                ...state,
                ...action.payload,
                token: null,
                user: null,
                userId: null,
                userRole: null,
                isAuthenticated: false,
                isLoading: false,
                errorMsg: action.payload.data.msg, //server의 routes/api/auth.js 를 참고하자
            }
        case CLEAR_ERROR_REQUEST:
            return {
                ...state,
                errorMsg: null,
            }
        case CLEAR_ERROR_SUCCESS:
            return {
                ...state,
                errorMsg: null,
            }
        case CLEAR_ERROR_FAILURE:
            return {
                ...state,
                errorMsg: null,
            } 
        case LOGOUT_SUCCESS:
                localStorage.removeItem("token");
                return {
                  token: null,
                  user: null,
                  userId: null,
                  isAuthenticated: false,
                  isLoading: false,
                  userRole: null,
                  errorMsg: "",
                };
        default:
            return state
    }
}

export default authReducer;