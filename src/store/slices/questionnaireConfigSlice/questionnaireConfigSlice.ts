import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  QuestionnaireConfigDto,
  QuestionnaireStepConfigDto,
  getQuestionnaireConfigs,
  getQuestionnaireStepConfigs,
} from '@app/api/questionnaire-config.api';
import { LoadReq } from '../types';

export type QuestionnaireConfigState = {
  byId: Record<number, QuestionnaireConfigDto>;
  stepConfigById: Record<number, QuestionnaireStepConfigDto>;
  configsLoad: LoadReq;
  stepsLoad: LoadReq;
};

const initialState: QuestionnaireConfigState = {
  byId: {},
  stepConfigById: {},
  configsLoad: {
    loading: false,
    loaded: false,
    error: undefined,
  },
  stepsLoad: {
    loading: false,
    loaded: false,
    error: undefined,
  },
};

export const fetchQuestionnaireConfigs = createAsyncThunk('questionnaireConfig/fetchAll', async () => {
  const response = await getQuestionnaireConfigs();
  return response;
});

export const fetchQuestionnaireStepConfigs = createAsyncThunk(
  'questionnaireConfig/fetchSteps',
  async (questionnaireConfigId: number) => {
    const response = await getQuestionnaireStepConfigs(questionnaireConfigId);
    return response;
  },
);
export const questionnaireConfigSlice = createSlice({
  name: 'questionnaireConfig',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchQuestionnaireConfigs actions
      .addCase(fetchQuestionnaireConfigs.pending, (state) => {
        state.configsLoad.loading = true;
      })
      .addCase(fetchQuestionnaireConfigs.fulfilled, (state, action) => {
        state.configsLoad.loading = false;
        state.configsLoad.loaded = true;
        action.payload.data.forEach((config) => {
          state.byId[config.id] = config;
        });
      })
      .addCase(fetchQuestionnaireConfigs.rejected, (state, action) => {
        state.configsLoad.loading = false;
        state.configsLoad.loaded = false;
        state.configsLoad.error = action.error.message;
      })
      // Handling fetchQuestionnaireStepConfigs actions
      .addCase(fetchQuestionnaireStepConfigs.pending, (state) => {
        state.stepsLoad.loading = true;
      })
      .addCase(fetchQuestionnaireStepConfigs.fulfilled, (state, action) => {
        state.stepsLoad.loading = false;
        state.stepsLoad.loaded = true;
        action.payload.forEach((stepConfig) => {
          state.stepConfigById[stepConfig.id] = stepConfig;
        });
      })
      .addCase(fetchQuestionnaireStepConfigs.rejected, (state, action) => {
        state.stepsLoad.loading = false;
        state.stepsLoad.loaded = false;
        state.stepsLoad.error = action.error.message;
      });
  },
});
