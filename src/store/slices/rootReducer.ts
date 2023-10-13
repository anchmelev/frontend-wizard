import { questionnaireConfigSlice } from './questionnaireConfigSlice/questionnaireConfigSlice';
import { questionnaireResponseSlice } from './questionnaireResponseSlice/questionnaireResponseSlice';

export const rootReducer = {
  questionnaireConfig: questionnaireConfigSlice.reducer,
  questionnaireResponse: questionnaireResponseSlice.reducer,
};

export const actions = {
  questionnaireConfig: questionnaireConfigSlice.actions,
  questionnaireResponse: questionnaireResponseSlice.actions,
};
