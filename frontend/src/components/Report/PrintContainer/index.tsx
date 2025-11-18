import React, { ReactNode, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrinterOutlined } from '@ant-design/icons';

import { Container, PdfContainer } from './styles';
import Button from 'antd/lib/button/button';
import { systemColors } from 'utils/defaultValues';

interface PropTypes {
  children: ReactNode;
  show: boolean;
  print?: boolean;
  title?: string;
}

const PrintContainer: React.FC<PropTypes> = ({
  children,
  show,
  print,
  title
}) => {
  useEffect(() => {
    print && handlePrint();
  }, [print]);
  const componentRef = useRef<HTMLHeadingElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Gramfort Hidrossemeadura'
  });

  return (
    <Container>
      {show && (
        <Button
          style={{ backgroundColor: systemColors.LIGHT_GREY, color: '#fff' }}
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          block
        >
          {title}
        </Button>
      )}

      <PdfContainer>
        <div ref={componentRef}>{children}</div>
      </PdfContainer>
    </Container>
  );
};

export default PrintContainer;
