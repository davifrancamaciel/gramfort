import React from 'react';
import { Image } from 'antd';
import { Container } from './styles';
import logo from 'assets/logo.png';

const Logo: React.FC = () => {
  return (
    <Container>
      <Image src={logo} preview={false} />
    </Container>
  );
};

export default Logo;
