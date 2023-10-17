import React, { memo, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks/storeHooks';
import { SurveySteps } from './SurveySteps/SurveySteps';
import { actions, selectors } from '@app/store/slices/rootReducer';
import { useSelector } from 'react-redux';
import { fetchSurveyConfig } from '@app/store/slices/surveyConfigSlice/surveyConfigSlice';
import { SurveyForm } from './SurveyForm/SurveyForm';
import { SurveyCard } from '../SurveyCard/SurveyCard';
import { fetchSurveyAnswer } from '@app/store/slices/surveyAnswerSlice/surveyAnswerSlice';
import { SurveyEditActions } from './SurveyEditActions';
import { useSurveyForm } from './useSurveyForm';
import { useNavigate } from 'react-router-dom';
import { Page } from '@app/router/Page';
import { useAsyncEffect } from '@app/hooks/useAsyncEffect';

interface SurveyEditProps {
  surveyConfigId: number;
  surveyAnswerId?: number;
}

export const SurveyEdit: React.FC<SurveyEditProps> = memo(({ surveyConfigId, surveyAnswerId }) => {
  const stepConfigs = useSelector(selectors.surveyConfig.makeSelectStepConfigsForId(surveyConfigId));
  const configLoading = useAppSelector((state) => state.surveyConfig.configLoading);
  const answerLoading = useAppSelector((state) => state.surveyAnswer.answerLoading);
  const surveyConfig = useAppSelector((state) => state.surveyConfig.byId[surveyConfigId]);
  const { surveyConfigIdToEditing, byId } = useAppSelector((state) => state.surveyAnswer);
  const formState = useSurveyForm(surveyConfigId, stepConfigs, surveyAnswerId);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useAsyncEffect(async () => {
    if (surveyAnswerId) {
      const results = await Promise.all([
        dispatch(fetchSurveyConfig(surveyConfigId)).unwrap(),
        dispatch(fetchSurveyAnswer(surveyAnswerId)).unwrap(),
      ]);

      if (results.every(Boolean)) {
        dispatch(actions.surveyAnswer.takeToEdit({ surveyAnswerId, surveyConfigId }));
      } else {
        navigate(Page.error404, { replace: true });
      }
    } else {
      await dispatch(fetchSurveyConfig(surveyConfigId));
    }
  }, [surveyAnswerId, dispatch, surveyConfigId]);

  const loading = useMemo(
    () => configLoading || answerLoading || stepConfigs.length === 0,
    [configLoading, answerLoading, stepConfigs.length],
  );

  let extra: React.ReactNode = undefined;
  if (surveyAnswerId && byId[surveyAnswerId] && surveyConfigIdToEditing[surveyConfigId]) {
    extra = (
      <SurveyEditActions
        handleSubmit={formState.handleSubmit}
        surveyAnswer={byId[surveyAnswerId]}
        editedSurveyAnswer={surveyConfigIdToEditing[surveyConfigId]}
      />
    );
  }

  return (
    <SurveyCard
      prefixTitle="Editing form"
      titleLoading={configLoading}
      postfixTitle={surveyConfig?.title}
      contentLoading={loading}
      extra={extra}
    >
      <SurveySteps surveyConfigId={surveyConfigId} stepConfigs={stepConfigs} surveyAnswerId={surveyAnswerId} />
      <SurveyForm formState={formState} stepConfigs={stepConfigs} />
    </SurveyCard>
  );
});
