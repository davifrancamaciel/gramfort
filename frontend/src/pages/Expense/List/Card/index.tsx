import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { CardPropTypes } from './interfaces';
import { Container } from './styles';
import { formatPrice } from 'utils/formatPrice';

const Card: React.FC<CardPropTypes> = (props) => {
  return (
    <Container color={props.color}>
      <strong>{props.text}</strong>
      <span>
        {props.loading ? (
          <LoadingOutlined />
        ) : props.value ? (
          formatPrice(props.value)
        ) : (
          0
        )}
      </span>
    </Container>
  );
};

export default Card;
