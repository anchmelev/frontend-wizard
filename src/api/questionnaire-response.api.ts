import { httpApi } from './http.api';
import { ListResponseDto } from './types';

export interface QuestionnaireResponseListItemDto {
  id: number;
  title: string;
  questionnaireConfigId: number;
  stepIds: number[];
}

export interface CreateQuestionnaireResponseDto {
  questionnaireConfigId: number;
  stepResponses: CreateQuestionnaireStepResponseDto[];
}

export interface CreateQuestionnaireStepResponseDto {
  stepConfigId: number;
  fieldValue: string | string[] | number;
}

export interface CreatedQuestionnaireResponseDto {
  questionnaireResponseId: number;
}

export function getQuestionnaireResponses(): Promise<ListResponseDto<QuestionnaireResponseListItemDto>> {
  return httpApi.get(`/questionnaire-response`).then(({ data }) => data);
}

export function createQuestionnaireResponses(
  dto: CreateQuestionnaireResponseDto,
): Promise<CreatedQuestionnaireResponseDto> {
  return httpApi.post(`/questionnaire-response`, dto).then(({ data }) => data);
}
