import styled from 'styled-components';
import { systemColors } from 'utils/defaultValues';

export const Container = styled.div`
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 40px;
  }

  th,
  td {
    border: 1px solid #333;
    padding: 6px;
    text-align: center;
  }

  th {
    background-color: #e0e0e0;
  }

  td:first-child {
    text-align: left;
    font-weight: bold;
  }

  /* Cores */
  .green {
    background-color: ${systemColors.GREEN};
  }

  /* azul */
  .blue {
    background-color: ${systemColors.BLUE};
  }

  /* vermelho */
  .red {
    background-color: ${systemColors.RED};
  }

  /* amarelo */
  .yellow {
    background-color: ${systemColors.YELLOW};
  }

  /* rosa */
  .pink {
    background-color: ${systemColors.LIGHT_PINK};
  }

  .gray {
    background-color: #f0f0f0;
  }
`;
