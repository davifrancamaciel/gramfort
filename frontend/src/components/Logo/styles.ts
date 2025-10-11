import styled from 'styled-components';
import { systemColors } from 'utils/defaultValues';

export const Container = styled.div`
  .web {
    display: block;
    @media (max-width: 800px) {
      display: none;
    }
  }
  .mobile {
    display: none;
    @media (max-width: 800px) {
      display: block;
    }
  }
  img {
    height: 32px;
    margin-right: 5px;
  }
  span:last-child {
    color: ${systemColors.RED_DARK};
    margin-left: 5px;
  }
  span {
    color: #333;
    font-size: 20px;
    font-weight: bold;
    @media (max-width: 800px) {
      display: none;
    }
  }
`;
