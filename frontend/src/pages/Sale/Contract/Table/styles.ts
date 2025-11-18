import styled from 'styled-components';

export const Clause = styled.div`
  margin-top: 10px;
  h3 {
    text-align: center;
    border-bottom: solid 1px;
    background-color: #ccc;
  }

  p {
    text-align: center;
    margin-bottom: 2px;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 50px;
  div {
    p {
      width: 320px;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  > table {
    width: 540px !important;
  }
  img {
    width: 120px;
    max-height: min-content;
  }
`;
