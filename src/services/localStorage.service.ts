import type { SurveyAnswer } from '@app/store/slices/surveyAnswerSlice/surveyAnswerSlice';

const PREFIX = 'wizard';
const HTTP_CACHE_VERSION = `${PREFIX}_http_cache_version`;
const ACCESS_TOKEN = `${PREFIX}_access_token`;
const REFRESH_TOKEN = `${PREFIX}_refresh_token`;
const SURVEY_CONFIG_ID_TO_EDITING = `${PREFIX}_survey_config_id_to_editing`;

export const readSurveyConfigIdToEditing = () => {
  let result: Record<number, SurveyAnswer> = {};

  try {
    const val = localStorage.getItem(SURVEY_CONFIG_ID_TO_EDITING);
    if (val) result = JSON.parse(val);
  } catch (error) {
    console.error(error);
  }

  return result;
};

export const persistSurveyConfigIdToEditing = (value: Record<number, SurveyAnswer>) => {
  localStorage.setItem(SURVEY_CONFIG_ID_TO_EDITING, JSON.stringify(value));
};

export const readCacheVersion = () => {
  let result: number | null = null;

  try {
    const val = localStorage.getItem(HTTP_CACHE_VERSION);
    if (val) result = JSON.parse(val);
  } catch (error) {
    console.error(error);
  }

  return result;
};

export const persistCacheVersion = (cacheVersion: number) => {
  localStorage.setItem(HTTP_CACHE_VERSION, String(cacheVersion));
};

export const persistAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN, token);
};

export const readAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN);
};

export const persistRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN, token);
};

export const readRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN);
};

export const deleteTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};
