import { persistCacheVersion, readCacheVersion } from '@app/services/localStorage.service';
import { httpApi } from './http.api';
import { SurveyConfigDto, SurveyStepConfigDto } from './survey-config.api';
import { ItemResponseDto, ListResponseDto } from './types';

export type FieldValueDto = string | string[] | number;

export interface SurveyAnswerDto {
  id: number;
  surveyConfig: Pick<SurveyConfigDto, 'id' | 'title'>;
  stepAnswers: SurveyStepAnswerDto[];
}

export interface CreateSurveyAnswerDto {
  surveyConfigId: number;
  stepAnswers: CreateSurveyStepAnswerDto[];
}

export interface CreateSurveyStepAnswerDto {
  stepConfigId: number;
  fieldValue: FieldValueDto;
}

export interface SurveyStepAnswerDto {
  id: number;
  stepConfig: Pick<SurveyStepConfigDto, 'id' | 'text'>;
  fieldValue: FieldValueDto;
}

export interface UpdateSurveyAnswerStepsDto {
  changedStepAnswers: UpdateSurveyStepAnswerDto[];
}

export interface UpdateSurveyStepAnswerDto extends Pick<SurveyStepAnswerDto, 'fieldValue' | 'id'> {}

let cacheVersion = readCacheVersion() || Date.now();

export function getSurveyAnswers(): Promise<ListResponseDto<SurveyAnswerDto>> {
  return httpApi.get(`/survey-answer?cacheVersion=${cacheVersion}`).then(({ data }) => data);
}

export function getSurveyAnswer(surveyAnswerId: number): Promise<ItemResponseDto<SurveyAnswerDto | null>> {
  return httpApi.get(`/survey-answer/${surveyAnswerId}?cacheVersion=${cacheVersion}`).then(({ data }) => data);
}

export function createSurveyAnswer(dto: CreateSurveyAnswerDto): Promise<SurveyAnswerDto> {
  updateCacheVersion();
  return httpApi.post(`/survey-answer`, dto).then(({ data }) => data);
}

export function updateSurveyStepAnswers(surveyAnswerId: number, dto: UpdateSurveyAnswerStepsDto): Promise<void> {
  updateCacheVersion();
  return httpApi.patch(`/survey-answer/${surveyAnswerId}`, dto);
}

function updateCacheVersion() {
  cacheVersion = Date.now();
  persistCacheVersion(cacheVersion);
}
