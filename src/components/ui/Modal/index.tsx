import styled from 'styled-components';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '../Button';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' | 'danger' }[];
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.large};
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.boxShadow};
  color: ${({ theme }) => theme.colors.text};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalBody = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Modal = ({ isOpen, title, children, onClose, actions = [] }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modal = (
    <Backdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {title && (
          <ModalHeader>
            <h2>{title}</h2>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
        {actions.length > 0 && (
          <ModalFooter>
            {actions.map((action, index) => (
              <Button key={index} variant={action.variant} onClick={action.onClick}>
                {action.label}
              </Button>
            ))}
          </ModalFooter>
        )}
      </ModalContent>
    </Backdrop>
  );

  return createPortal(modal, document.body);
};

export default Modal;