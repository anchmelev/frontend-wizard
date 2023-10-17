import { Typography, Space } from 'antd';
import * as S from './SurveyRow.style';
import { Loading } from '@app/components/Loading/Loading';

const { Text } = Typography;

export const RowLoading: React.FC = () => {
  return (
    <S.CardContainer >
      <S.CardBody>
        <S.Cell $center>
          <Space>
            <Text>Data loading...</Text>
            <Loading size="2em" ownWidth />
          </Space>
        </S.Cell>
      </S.CardBody>
    </S.CardContainer>
  );
};
