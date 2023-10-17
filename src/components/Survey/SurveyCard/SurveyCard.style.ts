import { LAYOUT, BREAKPOINTS } from '@app/styles/constants';
import { Card, Row, Typography } from 'antd';
import styled from 'styled-components';

export const StickyCard = styled(Card)`
  margin: ${LAYOUT.desktop.paddingVertical} 0;

  .ant-card-head {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: inherit;
  }

  @media only screen and (max-width: ${BREAKPOINTS.md}px) {
    margin: ${LAYOUT.mobile.paddingVertical} 0;

    .ant-card-head {
      top: -2px;
    }
  }
`;

export const CardContent = styled(Row)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Text = styled(Typography.Text)`
  font-size: 18px;
`;
