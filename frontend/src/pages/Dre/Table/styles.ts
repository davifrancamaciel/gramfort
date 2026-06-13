import styled from 'styled-components';

export const Container = styled.div`
  width: 1100px;

  table {
    border-collapse: collapse;
    margin-bottom: 40px;
    font-size: 10px;
    width: 1100px;
  }

  th,
  td {
    border: 1px solid #333;
    padding: 3px;
    text-align: center;
    white-space: nowrap;
  }
  .BLANK td {
    border-left: 1px solid #fff !important;
    border-right: 1px solid #fff !important;
  }

  th {
    background-color: #e0e0e0;
  }

  td:first-child {
    text-align: left;
    font-weight: bold;
  }
`;
