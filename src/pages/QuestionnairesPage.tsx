import React from 'react';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { QuestionnaireList } from '@app/components/Questionnaire/QuestionnaireList/QuestionnaireList';

const QuestionnairesPage: React.FC = () => {
  return (
    <>
      <PageTitle>Questionnaires</PageTitle>
      <QuestionnaireList />
    </>
  );
};

export default QuestionnairesPage;
