import React from 'react';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { SurveyList } from '@app/components/Survey/SurveyList/SurveyList';

const SurveysPage: React.FC = () => {
  return (
    <>
      <PageTitle>Surveys</PageTitle>
      <SurveyList />
    </>
  );
};

export default SurveysPage;
