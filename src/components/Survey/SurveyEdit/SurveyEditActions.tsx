import React, { memo, useMemo, useState } from 'react';
import { Button, Popconfirm, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import isEqual from 'lodash/isEqual';
import { useUnload } from '@app/hooks/useUnload';
import { ConfirmNavigation } from '@app/components/ConfirmNavigation/ConfirmNavigation';
import { useResponsive } from '@app/hooks/useResponsive';
import { SurveyAnswer } from '@app/store/slices/surveyAnswerSlice/surveyAnswerSlice';
import { useNavigate } from 'react-router-dom';
import { SurveyFormState } from './useSurveyForm';
import { Page } from '@app/router/Page';

interface CharacterViewProps extends Pick<SurveyFormState, 'handleSubmit'> {
  surveyAnswer: SurveyAnswer;
  editedSurveyAnswer: SurveyAnswer;
}

export const SurveyEditActions: React.FC<CharacterViewProps> = memo(
  ({ surveyAnswer, handleSubmit, editedSurveyAnswer }) => {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const { isTablet } = useResponsive();
    const navigate = useNavigate();

    const isChanged = useMemo(() => !isEqual(surveyAnswer, editedSurveyAnswer), [surveyAnswer, editedSurveyAnswer]);

    const handleCancel = () => {
      if (isChanged) {
        setShowCancelConfirm(true);
      } else {
        setShowCancelConfirm(false);
        navigate(Page.home);
      }
    };

    useUnload(
      (e) => {
        if (isChanged) {
          e.preventDefault();
          e.returnValue = '';
        }
      },
      [isChanged],
    );

    return (
      <>
        <ConfirmNavigation shouldBlock={isChanged} />
        <Space>
          <Popconfirm
            title="Are you sure you want to cancel your changes?"
            open={showCancelConfirm}
            onConfirm={() => navigate(-1)}
            onCancel={() => setShowCancelConfirm(false)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="dashed" icon={<CloseOutlined />} onClick={handleCancel}>
              {isTablet && 'Cancel'}
            </Button>
          </Popconfirm>

          <Button type="primary" disabled={!isChanged} icon={<CheckOutlined />} onClick={handleSubmit}>
            {isTablet && 'Save'}
          </Button>
        </Space>
      </>
    );
  },
);
