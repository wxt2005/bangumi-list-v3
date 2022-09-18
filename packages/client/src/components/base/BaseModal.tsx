import React from 'react';
import FocusTrap from 'focus-trap-react';
import ModalWrapper from './ModalWrapper';
import CloseIcon from '../../images/close.svg';
import styles from './BaseModal.module.css';

interface Props {
  children?: React.ReactNode;
  isVisible?: boolean;
  title?: string;
  showClose?: boolean;
  clickMaskToClose?: boolean;
  onClose?: () => void;
}

export default function BaseModal(props: Props): JSX.Element | null {
  const {
    children,
    isVisible = false,
    showClose = false,
    clickMaskToClose = true,
    title,
    onClose,
  } = props;

  if (!isVisible) return null;

  return (
    <ModalWrapper>
      <div
        className={styles.mask}
        onClick={clickMaskToClose ? onClose : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && onClose) onClose();
        }}
      >
        <FocusTrap
          focusTrapOptions={{
            initialFocus: '#modal-close',
            fallbackFocus: '#modal',
          }}
        >
          <div
            id="modal"
            className={styles.container}
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.header}>
              {title ? <h3 className={styles.title}>{title}</h3> : null}
              {showClose ? (
                <button
                  className={styles.closeButton}
                  type="button"
                  onClick={onClose}
                  aria-label="关闭"
                  id="modal-close"
                >
                  <CloseIcon />
                </button>
              ) : null}
            </header>
            <section className={styles.content}>{children}</section>
          </div>
        </FocusTrap>
      </div>
    </ModalWrapper>
  );
}
