import React from 'react';
import { Route, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@app/components/MainLayout/MainLayout';
import { withLoading } from './withLoading.hoc';
import { Page } from './Page';
import { RequireAuth } from './RequireAuth';

const error404PagePromise = import('@app/pages/Error404Page');
const surveysPagePromise = import('@app/pages/SurveysPage');
const surveyViewPagePromise = import('@app/pages/SurveyViewPage');
const surveyEditPagePromise = import('@app/pages/SurveyEditPage');
const surveyAddPagePromise = import('@app/pages/SurveyAddPage');

const Error404Page = withLoading(React.lazy(() => error404PagePromise));
const SurveysPage = withLoading(React.lazy(() => surveysPagePromise));
const SurveyViewPage = withLoading(React.lazy(() => surveyViewPagePromise));
const SurveyEditPage = withLoading(React.lazy(() => surveyEditPagePromise));
const SurveyAddPage = withLoading(React.lazy(() => surveyAddPagePromise));

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path={Page.home} element={protectedLayout}>
          <Route index element={<SurveysPage />} />
          <Route path={`${Page.surveyView}/:surveyAnswerId`} element={<SurveyViewPage />} />
          <Route path={`${Page.surveyEdit}/:surveyConfigId/:surveyAnswerId`} element={<SurveyEditPage />} />
          <Route path={`${Page.surveyAdd}/:surveyConfigId`} element={<SurveyAddPage />} />
          <Route path={Page.error404} element={<Error404Page />} />
        </Route>
        <Route path="*" element={<Navigate replace to={Page.error404} />} />
      </>,
    ),
  );

  return <RouterProvider router={router} />;
};
