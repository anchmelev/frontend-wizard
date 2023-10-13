import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { EDIT_QUESTIONNAIRE_RESPONSE_LS_KEY } from './constants';
import {
  CreateQuestionnaireResponseDto,
  QuestionnaireResponseListItemDto,
  createQuestionnaireResponses,
  getQuestionnaireResponses,
} from '@app/api/questionnaire-response.api';
import { LoadReq } from '../types';

export type QuestionnaireResponse = QuestionnaireResponseListItemDto;

let editing: QuestionnaireResponse | null = null;

try {
  const val = localStorage.getItem(EDIT_QUESTIONNAIRE_RESPONSE_LS_KEY);
  if (val) editing = val ? JSON.parse(val) : null;
} catch (error) {
  console.error(error);
}

export type QuestionnaireResponseState = {
  byId: Record<number, QuestionnaireResponse>;
  editing: Partial<QuestionnaireResponse> | null;
  responsesLoad: LoadReq;
};

const initialState: QuestionnaireResponseState = {
  byId: {},
  editing,
  responsesLoad: {
    loading: false,
    loaded: false,
    error: undefined,
  },
};

export const fetchQuestionnaireResponses = createAsyncThunk('questionnaireResponse/fetchAll', async () => {
  return await getQuestionnaireResponses();
});

export const createQuestionnaireResponse = createAsyncThunk(
  'questionnaireResponse/create',
  async (dto: CreateQuestionnaireResponseDto) => {
    return await createQuestionnaireResponses(dto);
  },
);

export const questionnaireResponseSlice = createSlice({
  name: 'questionnaireResponse',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionnaireResponses.pending, (state) => {
        state.responsesLoad.loading = true;
      })
      .addCase(fetchQuestionnaireResponses.fulfilled, (state, action) => {
        state.responsesLoad.loading = false;
        state.responsesLoad.loaded = true;
        action.payload.data.forEach((response) => {
          state.byId[response.id] = response;
        });
      })
      .addCase(fetchQuestionnaireResponses.rejected, (state, action) => {
        state.responsesLoad.loading = false;
        state.responsesLoad.loaded = false;
        state.responsesLoad.error = action.error.message;
      })
      .addCase(createQuestionnaireResponse.pending, (state) => {
        // здесь вы можете установить флаги или состояния, которые говорят о том, что создание началось
      })
      .addCase(createQuestionnaireResponse.fulfilled, (state, action) => {
        // здесь вы можете обновить свое состояние на основе успешного создания, например, добавить новый ответ в byId
      })
      .addCase(createQuestionnaireResponse.rejected, (state) => {
        // здесь вы можете установить сообщение об ошибке или сбросить флаги
      });
  },
});
