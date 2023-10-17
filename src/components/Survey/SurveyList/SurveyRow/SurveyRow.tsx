import { Typography, Space, Button, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import * as S from './SurveyRow.style';
import { useNavigate } from 'react-router-dom';
import { Page } from '@app/router/Page';
import { COLORS } from '@app/styles/constants';
import { memo, useMemo } from 'react';
import { useResponsive } from '@app/hooks/useResponsive';

const { Text } = Typography;

export interface SurveyRowProps {
  surveyConfigId: number;
  surveyAnswerId?: number;
  title: string;
  totalStepCount: number;
  finishedStepCount: number;
}

export const SurveyRow: React.FC<SurveyRowProps> = memo(
  ({ surveyConfigId, surveyAnswerId, title, totalStepCount, finishedStepCount }) => {
    const navigate = useNavigate();

    const { isTablet, isMobile } = useResponsive();

    const finished = useMemo(
      () => finishedStepCount > 0 && finishedStepCount === totalStepCount,
      [totalStepCount, finishedStepCount],
    );

    const fillingHasStarted = useMemo(
      () => !surveyAnswerId && totalStepCount !== finishedStepCount && finishedStepCount > 0,
      [surveyAnswerId, totalStepCount, finishedStepCount],
    );

    const { status, statusColor } = useMemo(() => {
      let status = 'Completed';
      let statusColor: string = COLORS.success;

      if (finishedStepCount === 0) {
        status = 'Not Started';
        statusColor = COLORS.primary;
      } else if (finishedStepCount > 0 && finishedStepCount !== totalStepCount) {
        status = 'In Progress';
        statusColor = COLORS.warning;
      }

      return { status, statusColor };
    }, [totalStepCount, finishedStepCount]);

    const stepCountTag = (
      <S.Tag color={COLORS.tagColor}>
        {finishedStepCount}/{totalStepCount}
      </S.Tag>
    );

    const handleEditClick = async () => {
      navigate(`${Page.surveyEdit}/${surveyConfigId}/${surveyAnswerId}`);
    };

    const handleStartClick = async () => {
      navigate(`${Page.surveyAdd}/${surveyConfigId}`);
    };

    return (
      <S.CardContainer>
        <S.CardBody wrap={false}>
          <S.Cell $ownWidth>
            <S.Tag color={statusColor}>{status}</S.Tag>
          </S.Cell>

          <S.Divider type="vertical" />

          <S.Cell>
            <S.TitleText>{title}</S.TitleText>
          </S.Cell>

          {isMobile && (
            <>
              {isTablet && <S.Divider type="vertical" />}

              <S.Cell $ownWidth={!isTablet}>
                <Text>
                  {isTablet && <strong>Steps Count: </strong>}

                  {stepCountTag}
                </Text>
              </S.Cell>
            </>
          )}

          <S.Divider type="vertical" />

          <S.Cell $ownWidth>
            <Space>
              <Tooltip title={surveyAnswerId ? 'View survey' : 'You need to full fill out a form'} placement="top">
                <Button
                  disabled={!finished}
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`${Page.surveyView}/${surveyAnswerId}`)}
                />
              </Tooltip>

              {surveyAnswerId ? (
                <Tooltip title="Edit survey" placement="top">
                  <Button icon={<EditOutlined />} onClick={handleEditClick} />
                </Tooltip>
              ) : (
                <Tooltip title={fillingHasStarted ? 'Continue fill the survey' : 'Start new survey'} placement="top">
                  <Button icon={fillingHasStarted ? <EditOutlined /> : <PlusOutlined />} onClick={handleStartClick} />
                </Tooltip>
              )}
            </Space>
          </S.Cell>
        </S.CardBody>
      </S.CardContainer>
    );
  },
);
