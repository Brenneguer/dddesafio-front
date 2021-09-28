import React, { AllHTMLAttributes, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import '../styles/modal.scss';

type ModalAlertProps = {
  onClick?: (event: any) => void | Promise<void>, // eslint-disable-line
  onClose: () => void,
  showModal: boolean,
  children: [title: AllHTMLAttributes<HTMLDivElement>,
    body: AllHTMLAttributes<HTMLDivElement>,
    footer?: AllHTMLAttributes<HTMLDivElement>];
  modalButtons: boolean;
  idProps?: string;
}

const defaultProps = {
  onClick: () => null,
  idProps: '',
};

ModalAlert.defaultProps = defaultProps;

export function ModalAlert(props: ModalAlertProps): JSX.Element {
  const [isModalOpen, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const {
    onClick, onClose, showModal, children, modalButtons, idProps,
  } = props;

  useEffect(() => {
    if (showModal) {
      handleShow();
    } else {
      handleClose();
    }
  });

  return (
    <Modal size="sm" show={isModalOpen} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{children[0]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children[1]}</Modal.Body>
      {
        modalButtons
          ? (
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="outline-primary" onClick={onClick}>
                Salvar
              </Button>
            </Modal.Footer>
          ) : <Modal.Footer id={idProps}>{children[2]}</Modal.Footer>
      }
    </Modal>
  );
}
