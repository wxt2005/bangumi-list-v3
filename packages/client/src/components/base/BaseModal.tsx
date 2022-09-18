import React from 'react';
import FocusTrap from 'focus-trap-react';
import ModalWrapper from './ModalWrapper';
import CloseIcon from '../../images/close.svg';
import styles from './BaseModal.module.css';

interface Props {
  children?: React.ReactNode;
  isVisible?: boolean;
  title: string;
  clickMaskToClose?: boolean;
  onClose?: () => void;
  id: string;
}

export default function BaseModal(props: Props): JSX.Element | null {
  const {
    children,
    isVisible = false,
    clickMaskToClose = true,
    title,
    onClose,
    id,
  } = props;

  if (!isVisible) return null;

  const modalID = `modal-${id}`;
  console.log(modalID);

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
            initialFocus: `#${modalID}-close`,
            fallbackFocus: 'body',
          }}
        >
          <section
            id={modalID}
            className={styles.container}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${modalID}-title`}
          >
            <header className={styles.header}>
              <h3 id={`${modalID}-title`} className={styles.title}>
                {title}
              </h3>
              <button
                className={styles.closeButton}
                type="button"
                onClick={onClose}
                aria-label="关闭"
                id={`${modalID}-close`}
              >
                <CloseIcon />
              </button>
            </header>
            <section className={styles.content}>{children}</section>
          </section>
        </FocusTrap>
      </div>
    </ModalWrapper>
  );
}
