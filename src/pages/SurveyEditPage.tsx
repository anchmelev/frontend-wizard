import React from 'react';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { SurveyEdit } from '@app/components/Survey/SurveyEdit/SurveyEdit';
import { useValidatedParams } from '@app/hooks/useValidatedParams';

const SurveyEditPage: React.FC = () => {
  const { surveyConfigId, surveyAnswerId } = useValidatedParams(['surveyConfigId', 'surveyAnswerId']);

  return (
    <>
      <PageTitle>Edit Survey</PageTitle>
      {surveyConfigId && <SurveyEdit surveyConfigId={surveyConfigId} surveyAnswerId={surveyAnswerId} />}
    </>
  );
};

export default SurveyEditPage;
