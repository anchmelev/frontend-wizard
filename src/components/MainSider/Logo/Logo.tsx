import React from 'react';
import { Image, ImageProps, Space } from 'antd';
import logo from '@app/assets/logo.svg';
import { Page } from '@app/router/Page';
import * as S from './Logo.style';

interface LogoProps extends Omit<ImageProps, 'src'> {}

export const Logo: React.FC<LogoProps> = (props) => {
  return (
    <S.LogoLink to={Page.home}>
      <Space>
        <Image preview={false} src={logo} alt="Wizard" width={48} height={48} {...props} />
        <S.BrandSpan>Wizard</S.BrandSpan>
      </Space>
    </S.LogoLink>
  );
};
