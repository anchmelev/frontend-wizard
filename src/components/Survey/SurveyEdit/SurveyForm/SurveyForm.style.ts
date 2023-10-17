import { BREAKPOINTS } from '@app/styles/constants';
import { Card } from 'antd';
import styled from 'styled-components';

export const FormContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 380px;
  min-height: 186px;
  margin-top: 24px;

  @media only screen and (max-width: ${BREAKPOINTS.sm}px) {
    width: 280px;
  }

  .step-counter {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
`;
