import React from 'react';
import { Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

interface PropTypes {
  to: string;
  title: string;
  text: string;
  backgroundColor?: string;
}

const CustomButton: React.FC<PropTypes> = (props) => {
  return (
    <Tooltip placement="top" title={props.title}>
      <Link to={props.to}>
        <Button
          style={{
            backgroundColor: props.backgroundColor,
            marginRight: 4
          }}
        >
          {props.text}
        </Button>
      </Link>
    </Tooltip>
  );
};

export default CustomButton;
