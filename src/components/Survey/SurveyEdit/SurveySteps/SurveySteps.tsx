import React, { memo, useState, useEffect, useRef } from 'react';
import { Steps } from 'antd';
import { useAppDispatch, useAppSelector } from '@app/hooks/storeHooks';
import * as S from './SurveySteps.style';
import { actions } from '@app/store/slices/rootReducer';
import { useDragScrollX } from '@app/hooks/useDragScrollX';
import { SurveyStepConfig } from '@app/store/slices/surveyConfigSlice/surveyConfigSlice';
import isEqual from 'lodash/isEqual';

export interface SurveyStepsProps {
  stepConfigs: SurveyStepConfig[];
  surveyConfigId: number;
  surveyAnswerId?: number;
}

export const MIN_WIDTH_STEP = 180;

export const SurveySteps: React.FC<SurveyStepsProps> = memo(({ stepConfigs, surveyConfigId, surveyAnswerId }) => {
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [lastTranslateX, setLastTranslateX] = useState(0);
  const onEvents = useDragScrollX({
    onDrag: (distance: number) => setTranslateX(lastTranslateX + distance),
    onStart: () => setLastTranslateX(translateX),
  });

  const { currentStep, surveyConfigIdToEditing, byId } = useAppSelector((state) => state.surveyAnswer);
  const dispatch = useAppDispatch();

  const containerRef = useRef<HTMLDivElement>(null);

  const isStepCompleted = (index: number) => {
    return index < currentStep || !!surveyConfigIdToEditing[surveyConfigId]?.stepAnswers[index];
  };

  const handleResize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  };

  const handleStepClick = (index: number) => {
    if (isStepCompleted(index)) {
      dispatch(actions.surveyAnswer.setCurrentStep(index));
    }
  };

  const isStepChanged = (index: number) => {
    if (!surveyAnswerId) {
      return false;
    }

    const stepEditing = surveyConfigIdToEditing[surveyConfigId]?.stepAnswers[index];
    const originStep = byId[surveyAnswerId]?.stepAnswers[index];

    return !isEqual(stepEditing, originStep);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (containerWidth !== null) {
      const stepWidth = MIN_WIDTH_STEP;
      const center = containerWidth / 2;
      const currentStepPosition = currentStep * stepWidth;
      const newTranslateX = center - currentStepPosition - stepWidth / 2;
      setTranslateX(newTranslateX);
    }
  }, [currentStep, containerWidth]);

  return (
    <S.StepsWrapper ref={containerRef} {...onEvents}>
      <S.Steps responsive={false} direction="horizontal" current={currentStep} $translateX={translateX}>
        {stepConfigs.map((step, index) => {
          let title = 'Not Started';
          const isCompleted = isStepCompleted(index);

          if (index === currentStep) {
            title = 'In Progress';
          } else if (isStepChanged(index)) {
            title = 'Changed';
          } else if (isCompleted) {
            title = 'Completed';
          }
          return (
            <Steps.Step
              style={{ minWidth: MIN_WIDTH_STEP, cursor: isCompleted ? 'pointer' : undefined }}
              key={step.id}
              title={title}
              description={step.text}
              disabled={!isCompleted}
              onClick={() => handleStepClick(index)}
            />
          );
        })}
      </S.Steps>
    </S.StepsWrapper>
  );
});
