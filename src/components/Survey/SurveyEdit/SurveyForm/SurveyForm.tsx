import React, { memo } from 'react';
import { Button, Typography, Form, Space } from 'antd';
import { FieldControl } from './FieldControl';
import { SurveyFormState } from '../useSurveyForm';
import { SurveyStepConfig } from '@app/store/slices/surveyConfigSlice/surveyConfigSlice';
import * as S from './SurveyForm.style';

export interface SurveyFormProps {
  stepConfigs: SurveyStepConfig[];
  formState: SurveyFormState;
}

export const SurveyForm: React.FC<SurveyFormProps> = memo(({ stepConfigs, formState }) => {
  const { form, currentStep, setCurrentStep, handleSubmit, handleNextClick } = formState;
  const { text, field, id } = stepConfigs[currentStep];
  const lastIndex = stepConfigs.length - 1;

  return (
    <S.FormContainer>
      <Form form={form} layout="vertical">
        <Typography.Text strong>{text}</Typography.Text>

        {field && (
          <FieldControl
            onPressEnter={currentStep === lastIndex ? handleSubmit : handleNextClick}
            field={field}
            configStepId={id}
          />
        )}

        <Space>
          {currentStep < lastIndex && (
            <Button type="primary" onClick={handleNextClick}>
              Save
            </Button>
          )}
          {currentStep === lastIndex && (
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Complete
            </Button>
          )}
          {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>}
        </Space>

        <div className="step-counter">
          {currentStep + 1}/{stepConfigs.length}
        </div>
      </Form>
    </S.FormContainer>
  );
});
