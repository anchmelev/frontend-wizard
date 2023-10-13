import React, { useLayoutEffect } from 'react';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from '@app/router/Page';
import { QuestionnaireEdit } from '@app/components/Questionnaire/QuestionnaireEdit/QuestionnaireEdit';

const QuestionnaireEditPage: React.FC = () => {
  const { id: idString } = useParams<{ id: string }>();
  const questionnaireConfigId = Number(idString);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (isNaN(questionnaireConfigId)) {
      navigate(Page.error404, { replace: true });
    }
  }, [questionnaireConfigId, navigate]);

  return (
    <>
      <PageTitle>Edit Questionnaire</PageTitle>
      {!isNaN(questionnaireConfigId) && <QuestionnaireEdit questionnaireConfigId={questionnaireConfigId} />}
    </>
  );
};

export default QuestionnaireEditPage;
