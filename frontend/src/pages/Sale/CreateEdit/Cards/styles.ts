import styled from 'styled-components';

export const Header = styled.section`
  gap: 18px;

  display: flex;
  justify-content: space-between;

  @media (max-width: 1200px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 950px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
