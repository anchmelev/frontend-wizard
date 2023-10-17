import type { RootState } from '@app/store/store';
import { createSelector } from '@reduxjs/toolkit';

const selectSurveyConfigState = (state: RootState) => state.surveyConfig;

export const makeSelectStepConfigsForId = (surveyConfigId: number) => {
  return createSelector([selectSurveyConfigState], (surveyConfig) => {
    const stepConfigIds = surveyConfig.byId[surveyConfigId]?.stepConfigIds ?? [];
    return stepConfigIds.map((stepConfigId) => surveyConfig.stepConfigById[stepConfigId]);
  });
};

export const surveyConfigSelectors = {
  makeSelectStepConfigsForId,
};
