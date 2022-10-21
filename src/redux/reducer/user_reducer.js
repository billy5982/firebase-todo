import { CLEAR_USER, SET_PHOTOURL, SET_USER } from '../actions/types';

const initialUserState = {
  currentUser: null,
  isLoading: true,
};

export default function (state = initialUserState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        //user 정보가 맞게 들어왔으면 로그인이 되었으니깐 false로 변환
        isLoading: false,
      };
    case CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        isLoading: false,
      };
    case SET_PHOTOURL:
      return {
        ...state,
        currentUser: { ...state, photoURL: action.payload },
      };
    default:
      return state;
  }
}
