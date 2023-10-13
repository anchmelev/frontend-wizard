import { Typography, Space, Button, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import * as S from './QuestionnaireCard.style';
import { useNavigate } from 'react-router-dom';
import { Page } from '@app/router/Page';
import { COLORS } from '@app/styles/constants';
import { useMemo } from 'react';
import { useResponsive } from '@app/hooks/useResponsive';
import { useAppDispatch, useAppSelector } from '@app/hooks/storeHooks';
import { fetchQuestionnaireStepConfigs } from '@app/store/slices/questionnaireConfigSlice/questionnaireConfigSlice';

const { Text } = Typography;

interface QuestionnaireCardProps {
  questionnaireId: number;
  title: string;
  totalStepCount: number;
  finishedStepCount: number;
}

export const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({
  questionnaireId,
  title,
  totalStepCount,
  finishedStepCount,
}) => {
  const navigate = useNavigate();
  const stepsLoad = useAppSelector((state) => state.questionnaireConfig.stepsLoad);
  const dispatch = useAppDispatch();

  const { isTablet, isMobile } = useResponsive();

  const finished = useMemo(
    () => finishedStepCount > 0 && finishedStepCount === totalStepCount,
    [totalStepCount, finishedStepCount],
  );

  const { status, statusColor } = useMemo(() => {
    let status = 'Finished';
    let statusColor: string = COLORS.success;

    if (finishedStepCount === 0) {
      status = 'New';
      statusColor = COLORS.primary;
    } else if (finishedStepCount > 0 && finishedStepCount !== totalStepCount) {
      status = 'Processing';
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
    // Если шаги еще не загружены, загрузите их
    if (!stepsLoad.loaded) {
      await dispatch(fetchQuestionnaireStepConfigs(questionnaireId));
    }

    // После загрузки шагов или если они уже были загружены, сделайте переход
    navigate(`${Page.questionnaireEdit}/${questionnaireId}`);
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
            {finished && (
              <Tooltip title="View questionnaire" placement="top">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`${Page.questionnaireView}/${questionnaireId}`)}
                />
              </Tooltip>
            )}

            <Tooltip title="Edit questionnaire" placement="top">
              <Button loading={stepsLoad.loading} icon={<EditOutlined />} onClick={handleEditClick} />
            </Tooltip>
          </Space>
        </S.Cell>
      </S.CardBody>
    </S.CardContainer>
  );
};
