import React from 'react';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { SurveyView } from '@app/components/Survey/SurveyView/SurveyView';
import { useValidatedParams } from '@app/hooks/useValidatedParams';

const SurveyViewPage: React.FC = () => {
  const { surveyAnswerId } = useValidatedParams(['surveyAnswerId']);

  return (
    <>
      <PageTitle>View Survey</PageTitle>
      {surveyAnswerId && <SurveyView surveyAnswerId={surveyAnswerId} />}
    </>
  );
};

export default SurveyViewPage;
