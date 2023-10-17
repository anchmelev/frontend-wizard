import React, { useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { ConfigFieldsDto, FieldType, MultiChoiceFieldDto, SingleChoiceFieldDto } from '@app/api/survey-config.api';
import { getFieldName } from '../useSurveyForm';

export interface FieldControlProps {
  field: ConfigFieldsDto;
  configStepId: number;
  onPressEnter: () => void;
}

const fullWidthStyle: React.CSSProperties = { width: '100%' };

export const FieldControl: React.FC<FieldControlProps> = ({ field, configStepId, onPressEnter }) => {
  const controlRef = useRef<any>(null);

  // Можно поддержать механику правил на сервере. Для простоты для всех полей будет по умолчанию правило обязательности заполнения
  const rules = [{ required: true, message: 'This field is required!' }];

  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.focus();
    }
  }, [field.type]);

  let content: React.ReactNode;

  switch (field.type) {
    case FieldType.input:
      content = <Input ref={controlRef} onPressEnter={onPressEnter} style={fullWidthStyle} allowClear />;
      break;
    case FieldType.numeric:
      content = <InputNumber ref={controlRef} onPressEnter={onPressEnter} style={fullWidthStyle} />;
      break;
    case FieldType.singleChoice:
      content = (
        <Select ref={controlRef} style={fullWidthStyle}>
          {(field as SingleChoiceFieldDto).options.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      );
      break;
    case FieldType.multiChoiceStep:
      content = (
        <Select ref={controlRef} mode="multiple" style={fullWidthStyle} allowClear>
          {(field as MultiChoiceFieldDto).options.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      );
      break;
    default:
      content = null;
  }

  return (
    <Form.Item label={field.label} name={getFieldName(configStepId)} rules={rules}>
      {content}
    </Form.Item>
  );
};
