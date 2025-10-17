import styled from 'styled-components';

interface ContainerProps {
  color?: string;
}

export const Container = styled.div<ContainerProps>`
  background: ${(props) => (props.color ? props.color : '#fff')};
  height: 80px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-shadow: 0px 6px 20px #99999933;
  position: relative;

  span {
    color: #fff;
    font-size: 25px;
    font-weight: bold;
  }
  strong {
    color: #fff;
    font-size: 18px;
    
  }
  div {
    position: absolute;
    bottom: 15px;
    right: 15px;
    svg {
      font-size: 70px;
      transition: font-size 0.2s;
      color: rgba(0, 0, 0, 0.15);
    }
  }
  &:hover {
    div {
      svg {
        font-size: 90px;
      }
    }
  }
`;

export const Header = styled.section`
  margin: 10px 0 25px;
    display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 950px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
