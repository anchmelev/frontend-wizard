import React, { useLayoutEffect, useMemo } from 'react';
import { Row, Col, Empty } from 'antd';
import * as S from './QuestionnaireList.style';
import { useAppDispatch, useAppSelector } from '@app/hooks/storeHooks';
import { CardLoading } from './QuestionnaireCard/CardLoading';
import { QuestionnaireCard } from './QuestionnaireCard/QuestionnaireCard';
import { fetchQuestionnaireConfigs } from '@app/store/slices/questionnaireConfigSlice/questionnaireConfigSlice';
import { fetchQuestionnaireResponses } from '@app/store/slices/questionnaireResponseSlice/questionnaireResponseSlice';

export const QuestionnaireList: React.FC = () => {
  const { configsLoad, byId: configById } = useAppSelector((state) => state.questionnaireConfig);
  const { responsesLoad, byId: respById } = useAppSelector((state) => state.questionnaireResponse);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    if (!configsLoad.loaded && !configsLoad.loading && !configsLoad.error) {
      dispatch(fetchQuestionnaireConfigs());
    }

    if (!responsesLoad.loaded && !responsesLoad.loading && !responsesLoad.error) {
      dispatch(fetchQuestionnaireResponses());
    }
  }, [dispatch, configsLoad, responsesLoad]);

  const loading = useMemo(() => configsLoad.loading || responsesLoad.loading, [configsLoad, responsesLoad]);

  const questionnaires = useMemo(() => {
    const configIdToResp = new Map(Object.values(respById).map((x) => [x.questionnaireConfigId, x]));
    let result: { id: number; title: string; totalStepCount: number; finishedStepCount: number }[] = [];

    for (const config of Object.values(configById)) {
      const resp = configIdToResp.get(config.id);
      result.push({
        id: config.id,
        title: config.title,
        totalStepCount: config.stepIds.length,
        finishedStepCount: resp?.stepIds.length ?? 0,
      });
    }

    return result;
  }, [configById, respById]);

  let content: React.ReactNode;
  if (questionnaires.length > 0) {
    content = questionnaires.map((q) => (
      <Col key={q.id} span={24}>
        <QuestionnaireCard
          questionnaireId={q.id}
          title={q.title}
          totalStepCount={q.totalStepCount}
          finishedStepCount={q.finishedStepCount}
        />
      </Col>
    ));
  } else if (loading) {
    content = <CardLoading />;
  } else {
    content = <S.EmptyList image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <Col>
      <S.Header justify={'space-between'} align={'middle'} wrap={false}>
        Fill all medical forms
      </S.Header>
      <Row gutter={loading ? undefined : 16} justify={'center'}>
        {content}
      </Row>
    </Col>
  );
};
