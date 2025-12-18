import styled from 'styled-components';

interface ContainerProps {
  color?: string;
}

export const Container = styled.div<ContainerProps>`
  background: ${(props) => (props.color ? props.color : '#fff')};
  height: 95px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-shadow: 0px 6px 20px #99999933;
  position: relative;

  span {
    color: #fff;
    font-size: 20px;
    font-weight: bold;
  }
  .card-decription {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-transform: uppercase;

    > strong {
      color: #fff;
      font-size: 13px;
      margin-top: 5px;
    }
  }
  .card-icon {
    position: absolute;
    bottom: 15px;
    right: 15px;
    svg {
      font-size: 60px;
      transition: font-size 0.2s;
      color: rgba(0, 0, 0, 0.15);
    }
  }
  &:hover {
    .card-icon {
      svg {
        font-size: 80px;
      }
    }
  }
`;
