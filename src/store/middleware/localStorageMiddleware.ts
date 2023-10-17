import { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import isEqual from 'lodash/isEqual';
import { actions } from '../slices/rootReducer';
import { doCreateSurveyAnswer } from '../slices/surveyAnswerSlice/surveyAnswerSlice';
import { persistSurveyConfigIdToEditing } from '@app/services/localStorage.service';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const relevantActions = new Set([
    actions.surveyAnswer.takeToEdit.type,
    actions.surveyAnswer.upsertEditingStep.type,
    doCreateSurveyAnswer.fulfilled.type,
  ]);

  if (!relevantActions.has(action.type)) {
    return next(action);
  }

  const prevEditingMap = (store.getState() as RootState).surveyAnswer.surveyConfigIdToEditing;

  const result = next(action);

  const currentEditingMap = (store.getState() as RootState).surveyAnswer.surveyConfigIdToEditing;

  if (!isEqual(prevEditingMap, currentEditingMap)) {
    persistSurveyConfigIdToEditing(currentEditingMap);
  }

  return result;
};
