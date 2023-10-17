import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ConfigFieldsDto,
  SurveyConfigDto,
  SurveyStepConfigDto,
  getSurveyConfig,
  getSurveyConfigs,
} from '@app/api/survey-config.api';
import { doCreateSurveyAnswer, fetchSurveyAnswer, fetchSurveyAnswers } from '../surveyAnswerSlice/surveyAnswerSlice';
import { SurveyAnswerDto } from '@app/api/survey-answer.api';

export type SurveyConfig = Omit<SurveyConfigDto, 'stepConfigs'> & {
  stepConfigIds: number[];
};

export type SurveyStepConfig = Omit<SurveyStepConfigDto, 'field'> & {
  field?: ConfigFieldsDto;
};

export type SurveyConfigState = {
  byId: Record<number, SurveyConfig>;
  stepConfigById: Record<number, SurveyStepConfig>;
  configLoading: boolean;
  configsLoading: boolean;
};

const initialState: SurveyConfigState = {
  byId: {},
  stepConfigById: {},
  configLoading: false,
  configsLoading: false,
};

export const fetchSurveyConfig = createAsyncThunk('surveyConfig/fetchOne', async (surveyConfigId: number) => {
  const answer = await getSurveyConfig(surveyConfigId);
  return answer.data;
});

export const fetchSurveyConfigs = createAsyncThunk('surveyConfig/fetchAll', async () => {
  const answer = await getSurveyConfigs();
  return answer;
});

export const surveyConfigSlice = createSlice({
  name: 'surveyConfig',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setSurveyStepConfig = (state: SurveyConfigState, dto: SurveyStepConfig) => {
      state.stepConfigById[dto.id] = {
        ...state.stepConfigById[dto.id],
        ...dto,
      };
    };

    const setSurveyConfig = (state: SurveyConfigState, dto: SurveyConfigDto) => {
      state.byId[dto.id] = {
        id: dto.id,
        title: dto.title,
        stepConfigIds: dto.stepConfigs.map((x) => x.id),
      };

      for (const stepConfig of dto.stepConfigs) {
        setSurveyStepConfig(state, stepConfig);
      }
    };

    const updateOrInitSurveyConfig = (state: SurveyConfigState, dto: SurveyAnswerDto | null) => {
      if (dto == null || !dto.surveyConfig) return;

      const { id, title } = dto.surveyConfig;
      const config = state.byId[id];

      if (config) {
        state.byId[id].title = title;
      } else {
        state.byId[id] = {
          id,
          title,
          stepConfigIds: [],
        };
      }

      for (const stepAnswer of dto.stepAnswers) {
        setSurveyStepConfig(state, stepAnswer.stepConfig);
      }
    };

    builder
      // Handling fetchSurveyConfigs actions
      .addCase(fetchSurveyConfigs.pending, (state) => {
        state.configsLoading = true;
      })
      .addCase(fetchSurveyConfigs.fulfilled, (state, action) => {
        state.configsLoading = false;
        action.payload.data.forEach((config) => setSurveyConfig(state, config));
      })
      .addCase(fetchSurveyConfigs.rejected, (state) => {
        state.configsLoading = false;
      })
      // Handling fetchSurveyConfig actions
      .addCase(fetchSurveyConfig.pending, (state) => {
        state.configLoading = true;
      })
      .addCase(fetchSurveyConfig.fulfilled, (state, action) => {
        state.configLoading = false;
        if (action.payload) {
          setSurveyConfig(state, action.payload);
        }
      })
      .addCase(fetchSurveyConfig.rejected, (state) => {
        state.configLoading = false;
      })

      .addCase(fetchSurveyAnswer.fulfilled, (state, action) => updateOrInitSurveyConfig(state, action.payload))
      .addCase(doCreateSurveyAnswer.fulfilled, (state, action) => updateOrInitSurveyConfig(state, action.payload))
      .addCase(fetchSurveyAnswers.fulfilled, (state, action) => {
        action.payload.data.forEach((answer) => {
          for (const stepAnswer of answer.stepAnswers) {
            setSurveyStepConfig(state, stepAnswer.stepConfig);
          }
        });
      });
  },
});
