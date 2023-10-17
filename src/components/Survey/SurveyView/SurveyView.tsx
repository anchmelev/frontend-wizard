import React from 'react';
import { Descriptions } from 'antd';
import { useAppDispatch, useAppSelector } from '@app/hooks/storeHooks';
import { fetchSurveyAnswer } from '@app/store/slices/surveyAnswerSlice/surveyAnswerSlice';
import { useResponsive } from '@app/hooks/useResponsive';
import { SurveyCard } from '../SurveyCard/SurveyCard';
import { useAsyncEffect } from '@app/hooks/useAsyncEffect';
import { Page } from '@app/router/Page';
import { useNavigate } from 'react-router-dom';

interface SurveyViewProps {
  surveyAnswerId: number;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ surveyAnswerId }) => {
  const answerLoading = useAppSelector((state) => state.surveyAnswer.answerLoading);
  const surveyAnswer = useAppSelector((state) => state.surveyAnswer.byId[surveyAnswerId]);
  const title = useAppSelector((state) => state.surveyConfig.byId[surveyAnswer?.surveyConfigId]?.title);
  const stepConfigById = useAppSelector((state) => state.surveyConfig.stepConfigById);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isTablet } = useResponsive();

  useAsyncEffect(async () => {
    const result = await dispatch(fetchSurveyAnswer(surveyAnswerId)).unwrap();
    if (result === null) {
      navigate(Page.error404, { replace: true });
    }
  }, []);

  return (
    <SurveyCard
      prefixTitle="View form"
      titleLoading={answerLoading}
      postfixTitle={title}
      contentLoading={answerLoading}
    >
      <Descriptions layout="vertical" column={isTablet ? 2 : 1}>
        {surveyAnswer?.stepAnswers.map((stepAnswer) => {
          const label = stepConfigById[stepAnswer.stepConfigId]?.text ?? '—';
          return (
            <Descriptions.Item label={label} key={stepAnswer.id}>
              {Array.isArray(stepAnswer.fieldValue) ? stepAnswer.fieldValue.join(', ') : stepAnswer.fieldValue}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </SurveyCard>
  );
};
