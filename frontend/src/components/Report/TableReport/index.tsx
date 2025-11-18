import React, { ReactNode, useEffect, useState } from 'react';
import { Container } from './styles';
import imageLastPage from 'assets/contract.jpg';

interface PropTypes {
  title: string;
  image: string;
  children: ReactNode;
  headerList?: string[];
  showImageLastPage?: boolean;
}

const TableReport: React.FC<PropTypes> = ({
  title,
  children,
  headerList,
  image,
  showImageLastPage
}) => {
  const [headerListItens, setHeaderListItens] = useState<string[]>([]);
  useEffect(() => {
    if (headerList) {
      setHeaderListItens(headerList);
    }
  }, [headerList]);
  return (
    <Container>
      <div className="page">
        <table style={{ fontSize: '12px' }} cellSpacing="0">
          {!showImageLastPage && (
            <thead>
              <tr>
                <th
                  style={{
                    border: 'none',
                    paddingTop: '25px',
                    paddingBottom: '25px'
                  }}
                  colSpan={headerListItens?.length ? headerListItens.length : 5}
                >
                  <header
                    style={{
                      justifyContent: title ? 'space-between' : 'center'
                    }}
                  >
                    <img alt={''} src={image} />
                    <h2>{title}</h2>
                  </header>
                </th>
              </tr>

              <tr>
                {headerListItens.map(
                  (titleHeader, i) =>
                    titleHeader && <th key={i}>{titleHeader}</th>
                )}
              </tr>
            </thead>
          )}
          <tbody>{children}</tbody>
        </table>
      </div>
      {showImageLastPage && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <img src={imageLastPage} alt="" style={{ maxWidth: '93%' }} />
        </div>
      )}
    </Container>
  );
};

export default TableReport;
