import {
  CreateSurveyAnswerDto,
  CreateSurveyStepAnswerDto,
  FieldValueDto,
  UpdateSurveyStepAnswerDto,
} from '@app/api/survey-answer.api';
import { useAppSelector, useAppDispatch } from '@app/hooks/storeHooks';
import { Page } from '@app/router/Page';
import {
  SurveyStepAnswer,
  doCreateSurveyAnswer,
  doUpdateSurveyAnswer,
} from '@app/store/slices/surveyAnswerSlice/surveyAnswerSlice';
import { actions } from '@app/store/slices/rootReducer';
import { Form, notification } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurveyStepConfig } from '@app/store/slices/surveyConfigSlice/surveyConfigSlice';
import isEqual from 'lodash/isEqual';

const DURATION_NOTICE = 5;

export function useSurveyForm(surveyConfigId: number, configSteps: SurveyStepConfig[], surveyAnswerId?: number) {
  const { surveyConfigIdToEditing, byId: surveyAnswerById } = useAppSelector((state) => state.surveyAnswer);
  const currentStepIndex = useAppSelector((state) => state.surveyAnswer.currentStep);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm<Record<string, FieldValueDto>>();

  useEffect(() => {
    const editing = surveyConfigIdToEditing[surveyConfigId];
    if (editing) {
      const formFields = transformToFormFields(editing.stepAnswers);
      form.setFieldsValue(formFields);
    }
  }, [surveyConfigId, surveyConfigIdToEditing, form]);

  const currentStep = configSteps[currentStepIndex];

  const setCurrentStep = (step: number) => {
    dispatch(actions.surveyAnswer.setCurrentStep(step));
  };

  const handleCreateSurveyAnswer = () => {
    const values = form.getFieldsValue(true);

    const dto = transformToDto(values, surveyConfigId, configSteps);

    dispatch(doCreateSurveyAnswer(dto))
      .unwrap()
      .then((answer) => {
        notification.success({
          message: 'Success',
          description: 'The survey was successfully saved.',
          placement: 'topRight',
          duration: DURATION_NOTICE,
        });

        navigate(`${Page.surveyView}/${answer.id}`, { replace: true });
      })
      .catch((error) => {
        console.error('Error creating survey:', error);
        notification.error({
          message: 'Error',
          description: 'An error occurred while saving the survey. Try again later.',
          placement: 'topRight',
          duration: DURATION_NOTICE,
        });
      });
  };

  const handleUpdateSurveyAnswerSteps = () => {
    if (!surveyAnswerId) return;

    const values = form.getFieldsValue(true);

    const initialSurveyAnswer = surveyAnswerById[surveyAnswerId];
    const stepConfigIdStepAnswer = new Map(initialSurveyAnswer.stepAnswers.map((x) => [x.stepConfigId, x]));

    const changedStepAnswers: UpdateSurveyStepAnswerDto[] = [];

    for (const step of configSteps) {
      const initialSurveyStepAnswer = stepConfigIdStepAnswer.get(step.id);
      if (initialSurveyStepAnswer === undefined) continue;

      const { fieldValue } = transformStepToDto(values, step.id);
      if (isEqual(initialSurveyStepAnswer.fieldValue, fieldValue)) continue;

      changedStepAnswers.push({ id: initialSurveyStepAnswer.id, fieldValue });
    }

    if (changedStepAnswers.length === 0) {
      navigate(Page.home);
      return;
    }

    dispatch(doUpdateSurveyAnswer({ changedStepAnswers, surveyAnswerId }))
      .then(() => {
        notification.success({
          message: 'Success!',
          description: 'The survey has been successfully updated.',
          placement: 'topRight',
          duration: DURATION_NOTICE,
        });

        navigate(`${Page.surveyView}/${surveyAnswerId}`);
      })
      .catch((error) => {
        console.error('Error creating survey:', error);
        notification.error({
          message: 'Error',
          description: 'An error occurred while updating the survey. Try again later.',
          placement: 'topRight',
          duration: DURATION_NOTICE,
        });
      });
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields([getFieldName(currentStep.id)]);

      if (surveyAnswerId) {
        handleUpdateSurveyAnswerSteps();
      } else {
        handleCreateSurveyAnswer();
      }
    } catch (errorInfo) {
      console.log('Validation failed:', errorInfo);
    }
  };

  const handleNextClick = async () => {
    try {
      const newStepIndex = currentStepIndex + 1;

      await form.validateFields([getFieldName(currentStep.id)]);

      dispatch(
        actions.surveyAnswer.upsertEditingStep({
          currentStepConfigId: currentStep.id,
          surveyConfigId: surveyConfigId,
          fieldValue: form.getFieldValue(getFieldName(currentStep.id)),
        }),
      );

      setCurrentStep(newStepIndex);
    } catch (errorInfo) {
      console.log('Validation failed:', errorInfo);
    }
  };

  return {
    form,
    currentStep: currentStepIndex,
    setCurrentStep,
    handleSubmit,
    handleNextClick,
  };
}

export type SurveyFormState = ReturnType<typeof useSurveyForm>;

export const getFieldName = (stepId: number) => `field_${stepId}`;

const transformToDto = (
  source: Record<string, FieldValueDto>,
  surveyConfigId: number,
  steps: SurveyStepConfig[],
): CreateSurveyAnswerDto => {
  const stepAnswers: CreateSurveyStepAnswerDto[] = steps.map((step) => transformStepToDto(source, step.id));

  return {
    surveyConfigId,
    stepAnswers,
  };
};

const transformStepToDto = (source: Record<string, FieldValueDto>, configStepId: number): CreateSurveyStepAnswerDto => {
  return {
    stepConfigId: configStepId,
    fieldValue: source[getFieldName(configStepId)],
  };
};

const transformToFormFields = (editingSteps: SurveyStepAnswer[]): Record<string, FieldValueDto> => {
  const fields: Record<string, FieldValueDto> = {};

  editingSteps.forEach((step) => {
    fields[getFieldName(step.stepConfigId)] = step.fieldValue;
  });

  return fields;
};
