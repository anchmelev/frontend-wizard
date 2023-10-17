import { surveyConfigSelectors } from './surveyConfigSlice/surveyConfigSelectors';
import { surveyConfigSlice } from './surveyConfigSlice/surveyConfigSlice';
import { surveyAnswerSelectors } from './surveyAnswerSlice/surveyAnswerSelectors';
import { surveyAnswerSlice } from './surveyAnswerSlice/surveyAnswerSlice';
import { authSlice } from './authSlice/authSlice';

export const rootReducer = {
  surveyConfig: surveyConfigSlice.reducer,
  surveyAnswer: surveyAnswerSlice.reducer,
  auth: authSlice.reducer,
};

export const actions = {
  surveyConfig: surveyConfigSlice.actions,
  surveyAnswer: surveyAnswerSlice.actions,
};

export const selectors = {
  surveyConfig: surveyConfigSelectors,
  surveyAnswer: surveyAnswerSelectors,
};
