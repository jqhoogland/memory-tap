// Redux imports
import { createStore, combineReducers } from "redux";

// Redux persists imports
import {
  persistStore,
  persistReducer,
  persistCombineReducers,
} from "redux-persist";
import ExpoFileSystemStorage from "redux-persist-expo-filesystem";

// Local imports
import rootReducer from "./reducers"; // the value from combineReducers

// This file setes up the necessary prerequisites for storing redux state
// on device past sessions.
const persistConfig = {
  key: "root",
  storage: ExpoFileSystemStorage,
};

const reducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(reducer);
  let persistor = persistStore(store);
  return { store, persistor };
};
