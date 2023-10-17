import { httpApi } from './http.api';
import { ItemResponseDto, ListResponseDto } from './types';

export enum FieldType {
  input = 'input',
  multiChoiceStep = 'multi-choice-step',
  numeric = 'numeric',
  singleChoice = 'single-choice',
}

export interface SurveyConfigDto {
  id: number;
  title: string;
  stepConfigs: SurveyStepConfigDto[];
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

export interface SurveyStepConfigDto {
  id: number;
  text: string;
  field: ConfigFieldsDto;
}

export function getSurveyConfigs(): Promise<ListResponseDto<SurveyConfigDto>> {
  return httpApi.get(`/survey-config`).then(({ data }) => data);
}

export function getSurveyConfig(surveyConfigId: number): Promise<ItemResponseDto<SurveyConfigDto | null>> {
  return httpApi.get(`/survey-config/${surveyConfigId}`).then(({ data }) => data);
}
