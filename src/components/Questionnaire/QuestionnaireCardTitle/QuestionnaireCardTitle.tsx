import React from 'react';
import { Space } from 'antd';
import { BackButton } from '@app/components/BackButton/BackButton';
import * as S from './QuestionnaireCardTitle.style';

export type QuestionnaireCardTitleProps = {
  title: string;
  to?: string;
};

export const QuestionnaireCardTitle: React.FC<QuestionnaireCardTitleProps> = ({ title, to }) => {
  return (
    <Space>
      <BackButton to={to} />
      <S.Text>{title}</S.Text>
    </Space>
  );
};
