import React from 'react';
import Popup from './Popup';
import error from '../images/error.svg';
import success from '../images/success.svg';

function InfoTooltip({ isOpen, onClose, isSuccess, message }) {
  return (
    <Popup
      name="confirm"
      classname="popup__container"
      isOpen={isOpen}
      onClose={onClose}
    >
      <img
        className="popup__image"
        src={isSuccess ? success : error}
        alt="Изображение"
      />
      <p className="popup__message">{message}</p>
    </Popup>
  );
}

export default InfoTooltip;