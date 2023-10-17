import styled from 'styled-components';
import { Steps as AntSteps } from 'antd';

interface StepsProps {
  $translateX: number;
}

export const Steps = styled(AntSteps).attrs<StepsProps>((props) => ({
  style: {
    transform: `translateX(${props.$translateX}px)`,
  },
}))<StepsProps>`
  white-space: nowrap;
  transition: transform 0.3s ease-out;
`;

export const StepsWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  user-select: none;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    z-index: 2;
  }
  &:before {
    left: 0;
    background: linear-gradient(to right, #141414, rgba(255, 255, 255, 0));
    display: block;
  }

  &:after {
    right: 0;
    background: linear-gradient(to left, #141414, rgba(255, 255, 255, 0));
    display: block;
  }
`;
