import React from 'react';
import { WhatsAppOutlined } from '@ant-design/icons';
import { systemColors } from 'utils/defaultValues';

interface PropTypes {
  phone?: string;
  text?: string;
  message?: string;
}

const WhatsApp: React.FC<PropTypes> = ({ phone, text, message }) => {
  if (phone) {
    const sendPhone = phone
      .replace('+55', '')
      .replace('(', '')
      .replace(')', '')
      .replace('-', '')
      .replace(',', '')
      .replace('+', '')
      .replace('*', '')
      .replace(' ', '')
      .replace(' ', '')
      .replace(' ', '')
      .replace(' ', '')
      .trim();
    const propMessage = message ? `&text=${message}` : '';
    return (
      <div>
        <WhatsAppOutlined color={systemColors.GREEN} />
        <a
          href={`https://api.whatsapp.com/send?phone=55${sendPhone}${propMessage}`}
          target={'_blank'}
        >
          {` `} {text ? text : phone}
        </a>
      </div>
    );
  }
  return <div />;
};

export default WhatsApp;
