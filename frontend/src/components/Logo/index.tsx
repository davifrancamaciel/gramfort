import React from 'react';
import { Image } from 'antd';
import { Container } from './styles';
import logo from 'assets/logo.png';
import logoGota from 'assets/logo-gota.png';

const Logo: React.FC = () => {
  return (
    <Container>
      <div className="web">
        <Image src={logo} preview={false} />
      </div>
      <div className="mobile">
        <Image src={logoGota} preview={false} />
      </div>
    </Container>
  );
};

export default Logo;
