import React from 'react';
import { Route, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@app/components/MainLayout/MainLayout';
import { withLoading } from './withLoading.hoc';
import { Page } from './Page';

const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const QuestionnairesPage = React.lazy(() => import('@app/pages/QuestionnairesPage'));
const QuestionnaireViewPage = React.lazy(() => import('@app/pages/QuestionnaireViewPage'));
const QuestionnaireEditPage = React.lazy(() => import('@app/pages/QuestionnaireEditPage'));

const Error404 = withLoading(Error404Page);
const Questionnaires = withLoading(QuestionnairesPage);
const QuestionnaireView = withLoading(QuestionnaireViewPage);
const QuestionnaireEdit = withLoading(QuestionnaireEditPage);

export const AppRouter: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path={Page.home} element={<MainLayout />}>
          <Route index element={<Questionnaires />} />
          <Route path={`${Page.questionnaireView}/:id`} element={<QuestionnaireView />} />
          <Route path={`${Page.questionnaireEdit}/:id`} element={<QuestionnaireEdit />} />
          <Route path={Page.error404} element={<Error404 />} />
        </Route>
        <Route path="*" element={<Navigate replace to={Page.error404} />} />
      </>,
    ),
  );

  return <RouterProvider router={router} />;
};
