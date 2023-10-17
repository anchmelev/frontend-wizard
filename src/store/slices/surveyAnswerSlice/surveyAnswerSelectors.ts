import type { RootState } from '@app/store/store';
import { createSelector } from '@reduxjs/toolkit';

const selectSurveyAnswerState = (state: RootState) => state.surveyAnswer;

export const makeSelectSurveyStepAnswers = (surveyAnswerId: number) => {
  return createSelector([selectSurveyAnswerState], (surveyAnswer) => {
    return surveyAnswer.byId[surveyAnswerId!]?.stepAnswers ?? [];
  });
};

export const surveyAnswerSelectors = {
  selectSurveyAnswerState,
  makeSelectSurveyStepAnswers,
};
