import React, { useLayoutEffect, useMemo } from 'react';
import { Row, Col, Empty, Typography } from 'antd';
import * as S from './SurveyList.style';
import { useAppDispatch, useAppSelector } from '@app/hooks/storeHooks';
import { RowLoading } from './SurveyRow/RowLoading';
import { SurveyRow, SurveyRowProps } from './SurveyRow/SurveyRow';
import { fetchSurveyConfigs } from '@app/store/slices/surveyConfigSlice/surveyConfigSlice';
import { fetchSurveyAnswers } from '@app/store/slices/surveyAnswerSlice/surveyAnswerSlice';
import { actions } from '@app/store/slices/rootReducer';

export const SurveyList: React.FC = () => {
  const { configsLoading, byId: configById } = useAppSelector((state) => state.surveyConfig);
  const { answersLoading, byId: respById, surveyConfigIdToEditing } = useAppSelector((state) => state.surveyAnswer);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(fetchSurveyConfigs());
    dispatch(fetchSurveyAnswers());
    dispatch(actions.surveyAnswer.clearCurrentStep());
  }, []);

  const loading = useMemo(() => configsLoading || answersLoading, [configsLoading, answersLoading]);

  const surveys = useMemo(() => {
    const configIdToResp = new Map(Object.values(respById).map((x) => [x.surveyConfigId, x]));
    let result: SurveyRowProps[] = [];

    for (const config of Object.values(configById)) {
      const resp = configIdToResp.get(config.id);
      const editingSteps = surveyConfigIdToEditing[config.id];

      result.push({
        surveyConfigId: config.id,
        surveyAnswerId: resp?.id,
        title: config.title,
        totalStepCount: config.stepConfigIds.length,
        finishedStepCount: resp?.stepAnswers.length ?? editingSteps?.stepAnswers.length ?? 0,
      });
    }

    return result;
  }, [configById, surveyConfigIdToEditing, respById]);

  let content: React.ReactNode;
  if (surveys.length > 0) {
    content = surveys.map((q) => (
      <Col key={q.surveyConfigId} span={24}>
        <SurveyRow
          surveyConfigId={q.surveyConfigId}
          surveyAnswerId={q.surveyAnswerId}
          title={q.title}
          totalStepCount={q.totalStepCount}
          finishedStepCount={q.finishedStepCount}
        />
      </Col>
    ));
  } else if (loading) {
    content = <RowLoading />;
  } else {
    content = <S.EmptyList image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <Col>
      <Typography.Title level={3}>Medical surveys</Typography.Title>
      <Row gutter={loading ? undefined : 16} justify={'center'}>
        {content}
      </Row>
    </Col>
  );
};
