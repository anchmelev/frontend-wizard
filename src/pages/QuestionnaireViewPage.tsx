import React, { useLayoutEffect } from 'react';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from '@app/router/Page';
import { QuestionnaireView } from '@app/components/Questionnaire/QuestionnaireView/QuestionnaireView';

const QuestionnaireViewPage: React.FC = () => {
  const { id: idString } = useParams<{ id: string }>();
  const questionnaireId = Number(idString);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (isNaN(questionnaireId)) {
      navigate(Page.error404, { replace: true });
    }
  }, [questionnaireId, navigate]);

  return (
    <>
      <PageTitle>View Questionnaire</PageTitle>
      {!isNaN(questionnaireId) && <QuestionnaireView questionnaireId={questionnaireId} />}
    </>
  );
};

export default QuestionnaireViewPage;
