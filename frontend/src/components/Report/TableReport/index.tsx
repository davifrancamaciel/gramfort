import React, { ReactNode, useEffect, useState } from 'react';
import { Container } from './styles';
interface PropTypes {
  title: string;
  image: string;
  imageFooterContract?: string;
  children: ReactNode;
  headerList?: string[];
  showImageLastPage?: boolean;
}

const TableReport: React.FC<PropTypes> = ({
  title,
  children,
  headerList,
  image,
  showImageLastPage,
  imageFooterContract
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
      {showImageLastPage && imageFooterContract && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <img src={imageFooterContract} alt="" style={{ maxWidth: '710px' }} />
        </div>
      )}
    </Container>
  );
};

export default TableReport;
