import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  CreateSurveyAnswerDto,
  SurveyAnswerDto,
  SurveyStepAnswerDto,
  UpdateSurveyAnswerStepsDto,
  createSurveyAnswer,
  getSurveyAnswer,
  getSurveyAnswers,
  updateSurveyStepAnswers,
} from '@app/api/survey-answer.api';
import { readSurveyConfigIdToEditing } from '@app/services/localStorage.service';

export type SurveyAnswer = Omit<SurveyAnswerDto, 'surveyConfig' | 'stepAnswers'> & {
  surveyConfigId: number;
  stepAnswers: SurveyStepAnswer[];
};

export type SurveyStepAnswer = Omit<SurveyStepAnswerDto, 'stepConfig'> & {
  stepConfigId: number;
};

type UpsertEditingStepAction = PayloadAction<
  { currentStepConfigId: number; surveyConfigId: number } & Pick<SurveyStepAnswerDto, 'fieldValue'>
>;

type UpdateSurveyAnswerPayload = UpdateSurveyAnswerStepsDto & { surveyAnswerId: number };

export type SurveyAnswerState = {
  byId: Record<number, SurveyAnswer>;
  surveyConfigIdToEditing: Record<number, SurveyAnswer>;
  currentStep: number;
  answersLoading: boolean;
  answerLoading: boolean;
  mutationLoading: boolean;
};

const initialState: SurveyAnswerState = {
  byId: {},
  surveyConfigIdToEditing: readSurveyConfigIdToEditing(),
  currentStep: 0,
  answersLoading: false,
  answerLoading: false,
  mutationLoading: false,
};

export const fetchSurveyAnswer = createAsyncThunk('surveyAnswer/findOne', async (surveyAnswerId: number) => {
  const answer = await getSurveyAnswer(surveyAnswerId);
  return answer.data;
});

export const fetchSurveyAnswers = createAsyncThunk('surveyAnswer/fetchAll', async () => {
  return await getSurveyAnswers();
});

export const doCreateSurveyAnswer = createAsyncThunk<SurveyAnswerDto, CreateSurveyAnswerDto>(
  'surveyAnswer/create',
  async (dto) => {
    const resp = await createSurveyAnswer(dto);
    return resp;
  },
);

export const doUpdateSurveyAnswer = createAsyncThunk<UpdateSurveyAnswerPayload, UpdateSurveyAnswerPayload>(
  'surveyAnswer/update',
  async (dto) => {
    await updateSurveyStepAnswers(dto.surveyAnswerId, { changedStepAnswers: dto.changedStepAnswers });
    return dto;
  },
);

export const surveyAnswerSlice = createSlice({
  name: 'surveyAnswer',
  initialState,
  reducers: {
    clearCurrentStep: (state) => {
      state.currentStep = 0;
    },

    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    takeToEdit: (state, action: PayloadAction<{ surveyAnswerId: number; surveyConfigId: number }>) => {
      const { surveyAnswerId, surveyConfigId } = action.payload;
      state.surveyConfigIdToEditing[surveyConfigId] = state.byId[surveyAnswerId];
    },

    upsertEditingStep: (state, action: UpsertEditingStepAction) => {
      const { currentStepConfigId, surveyConfigId, fieldValue } = action.payload;

      let editingStepsForConfig = state.surveyConfigIdToEditing[surveyConfigId];

      if (!editingStepsForConfig) {
        editingStepsForConfig = {
          id: generateTempId(),
          surveyConfigId: surveyConfigId,
          stepAnswers: [],
        };
        state.surveyConfigIdToEditing[surveyConfigId] = editingStepsForConfig;
      }

      const existingStepIndex = editingStepsForConfig.stepAnswers.findIndex(
        (step) => step.stepConfigId === currentStepConfigId,
      );

      const existingStep = editingStepsForConfig.stepAnswers[existingStepIndex];
      const stepId = existingStep ? existingStep.id : generateTempId();

      const currentStepData: SurveyStepAnswer = {
        id: stepId,
        stepConfigId: currentStepConfigId,
        fieldValue: fieldValue,
      };

      if (existingStep) {
        editingStepsForConfig.stepAnswers[existingStepIndex] = currentStepData;
      } else {
        editingStepsForConfig.stepAnswers.push(currentStepData);
      }
    },
  },
  extraReducers: (builder) => {
    const setAnswer = (state: SurveyAnswerState, dto: SurveyAnswerDto) => {
      state.byId[dto.id] = {
        ...dto,
        stepAnswers: dto.stepAnswers.map((x) => ({
          id: x.id,
          stepConfigId: x.stepConfig.id,
          fieldValue: x.fieldValue,
        })),
        surveyConfigId: dto.surveyConfig.id,
      };
    };

    builder
      .addCase(fetchSurveyAnswers.pending, (state) => {
        state.answersLoading = true;
      })
      .addCase(fetchSurveyAnswers.fulfilled, (state, action) => {
        state.answersLoading = false;
        action.payload.data.forEach((answer) => {
          setAnswer(state, answer);
        });
      })
      .addCase(fetchSurveyAnswers.rejected, (state) => {
        state.answersLoading = false;
      })
      .addCase(doCreateSurveyAnswer.pending, (state) => {
        state.mutationLoading = true;
      })
      .addCase(doCreateSurveyAnswer.fulfilled, (state, action) => {
        state.mutationLoading = false;
        setAnswer(state, action.payload);
        state.currentStep = 0;
        delete state.surveyConfigIdToEditing[action.payload.surveyConfig.id];
      })
      .addCase(doCreateSurveyAnswer.rejected, (state) => {
        state.mutationLoading = false;
      })

      .addCase(doUpdateSurveyAnswer.pending, (state) => {
        state.mutationLoading = true;
      })
      .addCase(doUpdateSurveyAnswer.fulfilled, (state, action) => {
        state.mutationLoading = false;

        const { surveyAnswerId, changedStepAnswers } = action.payload;

        const answer = state.byId[surveyAnswerId];

        if (answer) {
          const stepAnswerIdToIndex = new Map(answer.stepAnswers.map((x, index) => [x.id, index]));

          changedStepAnswers.forEach((changedStep) => {
            const stepIndex = stepAnswerIdToIndex.get(changedStep.id);

            if (stepIndex != null) {
              answer.stepAnswers[stepIndex].fieldValue = changedStep.fieldValue;
            }
          });
        }

        state.currentStep = 0;
        delete state.surveyConfigIdToEditing[answer.surveyConfigId];
      })
      .addCase(doUpdateSurveyAnswer.rejected, (state) => {
        state.mutationLoading = false;
      })
      .addCase(fetchSurveyAnswer.pending, (state) => {
        state.answerLoading = true;
      })
      .addCase(fetchSurveyAnswer.fulfilled, (state, action) => {
        state.answerLoading = false;
        if (action.payload) {
          setAnswer(state, action.payload);
        }
      })
      .addCase(fetchSurveyAnswer.rejected, (state) => {
        state.answerLoading = false;
      });
  },
});

function generateTempId(): number {
  return -new Date().getTime();
}
