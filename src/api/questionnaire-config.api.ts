import { httpApi } from './http.api';
import { ListResponseDto } from './types';

export enum FieldType {
  input = 'input',
  multiChoiceStep = 'multi-choice-step',
  numeric = 'numeric',
  singleChoice = 'single-choice',
}

export interface QuestionnaireConfigDto {
  id: number;
  title: string;
  stepIds: number[];
}

export interface FieldDto {
  id: number;
  label: string;
  type: FieldType;
}

export interface MultiChoiceFieldDto extends FieldDto {
  options: string[];
}

export interface NumericFieldDto extends FieldDto {}

export interface InputFieldDto extends FieldDto {}

export interface SingleChoiceFieldDto extends FieldDto {
  options: string[];
}

export type ConfigFieldsDto = InputFieldDto | MultiChoiceFieldDto | NumericFieldDto | SingleChoiceFieldDto;

export interface QuestionnaireStepConfigDto {
  id: number;
  text: string;
  field: ConfigFieldsDto;
}

export function getQuestionnaireConfigs(): Promise<ListResponseDto<QuestionnaireConfigDto>> {
  return httpApi.get(`/questionnaire-config`).then(({ data }) => data);
}

export function getQuestionnaireStepConfigs(questionnaireConfigId: number): Promise<QuestionnaireStepConfigDto[]> {
  return httpApi.get(`/questionnaire-config/${questionnaireConfigId}/steps`).then(({ data }) => data);
}
