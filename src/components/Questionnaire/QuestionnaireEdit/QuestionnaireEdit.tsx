import React, { memo, useState, useEffect } from 'react';
import { Button, Col, Form, Row, Steps, Input, InputNumber, Select } from 'antd';
import { QuestionnaireCardTitle } from '../QuestionnaireCardTitle/QuestionnaireCardTitle';
import { StickyCard } from '../QuestionnaireView/QuestionnaireView.style';
import { useAppSelector } from '@app/hooks/storeHooks';
import {
  ConfigFieldsDto,
  FieldType,
  MultiChoiceFieldDto,
  SingleChoiceFieldDto,
} from '@app/api/questionnaire-config.api';
import { QuestionnaireResponse } from '@app/store/slices/questionnaireResponseSlice/questionnaireResponseSlice';

const { Step } = Steps;

interface QuestionnaireEditProps {
  questionnaireConfigId: number;
}

export const QuestionnaireEdit: React.FC<QuestionnaireEditProps> = memo(({ questionnaireConfigId }) => {
  const questionnaireConfig = useAppSelector((state) => state.questionnaireConfig.byId[questionnaireConfigId]);
  const questionnaireConfigs = useAppSelector((state) => state.questionnaireConfig);
  const questionnaireResponse = useAppSelector((state) => state.questionnaireResponse.editing);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm<QuestionnaireResponse>();

  useEffect(() => {
    if (questionnaireResponse) {
      form.setFieldsValue(questionnaireResponse);
    }
  }, [questionnaireResponse, form]);

  const renderFieldControl = (field: ConfigFieldsDto) => {
    switch (field.type) {
      case FieldType.input:
        return <Input />;
      case FieldType.numeric:
        return <InputNumber />;
      case FieldType.singleChoice:
        return (
          <Select>
            {(field as SingleChoiceFieldDto).options.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );
      case FieldType.multiChoiceStep:
        return (
          <Select mode="multiple">
            {(field as MultiChoiceFieldDto).options.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <StickyCard
      title={<QuestionnaireCardTitle title="Editing form" />}
      style={{ width: '100%', height: 'calc(100vh - 2.5rem)' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log('Form values:', values);
          // TODO: Add submission logic
        }}
      >
        <Row>
          <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {questionnaireConfig && (
              <Form.Item
                name={`field_${questionnaireConfigs.stepConfigById[questionnaireConfig.stepIds[currentStep]].field.id}`}
                label={questionnaireConfigs.stepConfigById[questionnaireConfig.stepIds[currentStep]].field.label}
              >
                {renderFieldControl(
                  questionnaireConfigs.stepConfigById[questionnaireConfig.stepIds[currentStep]].field,
                )}
              </Form.Item>
            )}
          </Col>

          <Col span={6}>
            <Steps direction="vertical" current={currentStep} onChange={(step) => setCurrentStep(step)}>
              {questionnaireConfig?.stepIds.map((stepId) => {
                const stepConfig = questionnaireConfigs.stepConfigById[stepId];
                const clickable = form.getFieldValue(`field_${stepConfig.field.id}`);
                return (
                  <Step key={stepId} title={stepConfig.text} onClick={() => clickable && setCurrentStep(stepId)} />
                );
              })}
            </Steps>
          </Col>
        </Row>

        <Row style={{ marginTop: '20px' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: '10px' }} onClick={() => setCurrentStep((prev) => prev - 1)}>
                Назад
              </Button>
            )}
            {currentStep < questionnaireConfig?.stepIds.length - 1 && (
              <Button type="primary" style={{ marginRight: '10px' }} onClick={() => setCurrentStep((prev) => prev + 1)}>
                Далее
              </Button>
            )}
            {currentStep === questionnaireConfig?.stepIds.length - 1 && (
              <Button type="primary" htmlType="submit">
                Завершить
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </StickyCard>
  );
});
