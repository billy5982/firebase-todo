// Reducer을 합쳐주기 위해 불러옴
import { combineReducers } from "redux";
import user from "./user_reducer";

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
