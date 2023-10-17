import React from 'react';
import { Space } from 'antd';
import { BackButton } from '@app/components/BackButton/BackButton';
import * as S from './SurveyCard.style';
import { COLORS } from '@app/styles/constants';
import { Loading } from '@app/components/Loading/Loading';
import { useResponsive } from '@app/hooks/useResponsive';

export type SurveyCardProps = {
  prefixTitle: string;
  postfixTitle: string;
  titleLoading: boolean;
  contentLoading: boolean;
  children: React.ReactNode;
  extra?: React.ReactNode;
};

export const SurveyCard: React.FC<SurveyCardProps> = (props) => {
  const { prefixTitle, postfixTitle, titleLoading, contentLoading, children } = props;
  const { isTablet } = useResponsive();

  return (
    <S.StickyCard
      title={
        <Space>
          <BackButton />
          <Space>
            {isTablet && <S.Text>{prefixTitle}</S.Text>}

            {titleLoading ? (
              <Loading ownWidth size="2em" />
            ) : (
              <S.Text style={{ color: COLORS.primary }}>{postfixTitle || '—'}</S.Text>
            )}
          </Space>
        </Space>
      }
      extra={props.extra}
    >
      <S.CardContent>{contentLoading ? <Loading /> : children}</S.CardContent>
    </S.StickyCard>
  );
};
