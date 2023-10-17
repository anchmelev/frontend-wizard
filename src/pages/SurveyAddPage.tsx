import React from 'react';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { SurveyEdit } from '@app/components/Survey/SurveyEdit/SurveyEdit';
import { useValidatedParams } from '@app/hooks/useValidatedParams';

const SurveyAddPage: React.FC = () => {
  const { surveyConfigId } = useValidatedParams(['surveyConfigId']);

  return (
    <>
      <PageTitle>Add Survey</PageTitle>
      {surveyConfigId && <SurveyEdit surveyConfigId={surveyConfigId} />}
    </>
  );
};

export default SurveyAddPage;
