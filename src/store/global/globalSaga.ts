import { all, put, takeEvery } from 'redux-saga/effects';
import { setPageState, setStateMessage } from './globalSlice';
import { setPageStateInfoAction, setPageStateInfoActionFormat } from './globalActions';


function* setPageStateInfo(action: setPageStateInfoActionFormat) {
  const {type, message} = action.payload;
  yield put(setPageState(type));
  yield put(setStateMessage(message));
}

export default function* globalSaga() {
  yield all([
    takeEvery(setPageStateInfoAction.type, setPageStateInfo),
  ]);
}