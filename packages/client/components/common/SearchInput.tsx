import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import ClearIcon from '../../images/clear.svg';
import styles from './SearchInput.module.css';

interface Props {
  className?: string;
  placeholder?: string;
  showClear?: boolean;
  onInput?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export default function SearchInput(props: Props): JSX.Element {
  const [value, setValue] = useState<string>('');
  const { className, placeholder, showClear = true, onInput, onSubmit } = props;
  const rootClassName = classNames(styles.root, className);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleSearchInput: React.FormEventHandler<HTMLInputElement> = (
    event
  ) => {
    const text = event.currentTarget.value;
    onInput && onInput(text);
    setValue(text);
  };
  const handleSearchFormSubmit: React.FormEventHandler<HTMLFormElement> = (
    e
  ) => {
    e.preventDefault();
    onSubmit && onSubmit(value);
    inputRef.current && inputRef.current.blur();
  };
  const handleClearClick = () => {
    setValue('');
    onInput && onInput('');
  };
  const showClearButton = showClear && !!value;

  return (
    <form className={rootClassName} action="" onSubmit={handleSearchFormSubmit}>
      {/* iOS need action to show search button */}
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        placeholder={placeholder}
        value={value}
        onInput={handleSearchInput}
      />
      {showClearButton ? (
        <button
          type="button"
          aria-label="清空输入框"
          onClick={handleClearClick}
          className={styles.clearButton}
        >
          <ClearIcon />
        </button>
      ) : null}
    </form>
  );
}
