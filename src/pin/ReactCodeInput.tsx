import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { uuidv4 } from './utils';

const BACKSPACE_KEY = 8;
const LEFT_ARROW_KEY = 37;
const UP_ARROW_KEY = 38;
const RIGHT_ARROW_KEY = 39;
const DOWN_ARROW_KEY = 40;
const E_KEY = 69;

interface ReactCodeInputProps {
  type?: 'text' | 'number' | 'password' | 'tel';
  fields?: number;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  touch?: (name: string) => void;
  untouch?: (name: string) => void;
  className?: string;
  isValid?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  inputStyleInvalid?: React.CSSProperties;
  autoComplete?: string;
  autoFocus?: boolean;
  forceUppercase?: boolean;
  filterKeyCodes?: number[];
  filterChars?: string[];
  filterCharsIsWhitelist?: boolean;
  pattern?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

const ReactCodeInput: React.FC<ReactCodeInputProps> = ({
  type = 'text',
  fields = 4,
  placeholder,
  value = '',
  onChange,
  name,
  touch,
  untouch,
  className,
  isValid = true,
  disabled = false,
  style = {},
  inputStyle = {},
  inputStyleInvalid = {},
  autoComplete = 'off',
  autoFocus = true,
  forceUppercase = false,
  filterKeyCodes = [189, 190],
  filterChars = ['-', '.'],
  filterCharsIsWhitelist = false,
  pattern,
  inputMode,
}) => {
  const [input, setInput] = useState<string[]>([]);
  const textInputRef = useRef<HTMLInputElement[]>([]);
  const uuid = useRef(uuidv4());

  useEffect(() => {
    let newValue = value;
    if (forceUppercase) {
      newValue = newValue.toUpperCase();
    }
    setInput(newValue.split('').map((char, i) => i < fields ? char : ''));
  }, [fields, forceUppercase, value]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleTouch(e.target.value);
  };

  const handleTouch = (value: string) => {
    if (typeof touch === 'function' && typeof untouch === 'function') {
      if (value === '') {
        touch(name || '');
      } else {
        untouch(name || '');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (forceUppercase) {
      newValue = newValue.toUpperCase();
    }

    if (type === 'number') {
      newValue = newValue.replace(/[^\d]/g, '');
    }

    newValue = newValue
      .split('')
      .filter((currChar) => {
        if (filterCharsIsWhitelist) {
          return filterChars.includes(currChar);
        }
        return !filterChars.includes(currChar);
      })
      .join('');

    const newInput = input.slice();
    const targetIndex = Number(e.target.dataset.id);

    if (newValue !== '') {
      if (newValue.length > 1) {
        newValue.split('').forEach((char, i) => {
          const index = targetIndex + i;
          if (index < fields) {
            newInput[index] = char;
          }
        });
      } else {
        newInput[targetIndex] = newValue;
      }

      newInput.forEach((char, i) => {
        if (textInputRef.current[i]) {
          textInputRef.current[i].value = char;
        }
      });

      const newTarget = textInputRef.current[targetIndex + 1];

      if (newTarget) {
        newTarget.focus();
        newTarget.select();
      }

      setInput(newInput);
    }

    const fullValue = newInput.join('');

    if (onChange && fullValue) {
      onChange(fullValue);
    }

    handleTouch(fullValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const targetIndex = Number(e.currentTarget.dataset.id);
    const nextTarget = textInputRef.current[targetIndex + 1];
    const prevTarget = textInputRef.current[targetIndex - 1];

    if (filterKeyCodes.length > 0 && filterKeyCodes.includes(e.keyCode)) {
      e.preventDefault();
      return;
    }

    switch (e.keyCode) {
      case BACKSPACE_KEY:
        e.preventDefault();
        textInputRef.current[targetIndex].value = '';
        const newInput = input.slice();
        newInput[targetIndex] = '';
        setInput(newInput);
        if (textInputRef.current[targetIndex].value === '') {
          if (prevTarget) {
            prevTarget.focus();
            prevTarget.select();
          }
        }
        if (onChange) {
          onChange(newInput.join(''));
        }
        break;

      case LEFT_ARROW_KEY:
        e.preventDefault();
        if (prevTarget) {
          prevTarget.focus();
          prevTarget.select();
        }
        break;

      case RIGHT_ARROW_KEY:
        e.preventDefault();
        if (nextTarget) {
          nextTarget.focus();
          nextTarget.select();
        }
        break;

      case UP_ARROW_KEY:
        e.preventDefault();
        break;

      case DOWN_ARROW_KEY:
        e.preventDefault();
        break;

      case E_KEY:
        if (type === 'number') {
          e.preventDefault();
          break;
        }
        break;

      default:
        break;
    }

    const fullValue = input.join('');
    handleTouch(fullValue);
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: { display: 'inline-block', ...style },
    input: isValid ? inputStyle : inputStyleInvalid,
  };

  if (!className && Object.keys(inputStyle).length === 0) {
    Object.assign(inputStyle, {
      fontFamily: 'monospace',
      MozAppearance: 'textfield',
      borderRadius: '6px',
      border: '1px solid',
      boxShadow: '0px 0px 10px 0px rgba(0,0,0,.10)',
      margin: '4px',
      paddingLeft: '8px',
      paddingRight: 0,
      width: '36px',
      height: '42px',
      fontSize: '32px',
      boxSizing: 'border-box',
      color: 'black',
      backgroundColor: 'white',
      borderColor: 'lightgrey',
    });
  }

  if (!className && Object.keys(inputStyleInvalid).length === 0) {
    Object.assign(inputStyleInvalid, {
      fontFamily: 'monospace',
      MozAppearance: 'textfield',
      borderRadius: '6px',
      border: '1px solid',
      boxShadow: '0px 0px 10px 0px rgba(0,0,0,.10)',
      margin: '4px',
      paddingLeft: '8px',
      paddingRight: 0,
      width: '36px',
      height: '42px',
      fontSize: '32px',
      boxSizing: 'border-box',
      color: '#b94a48',
      backgroundColor: '#f2dede',
      borderColor: '#eed3d7',
    });
  }

  if (disabled) {
    Object.assign(styles.input, {
      cursor: 'not-allowed',
      color: 'lightgrey',
      borderColor: 'lightgrey',
      backgroundColor: '#efeff1',
    });
  }

  return (
    <div className={classNames(className, 'react-code-input')} style={styles.container}>
      {input.map((value, i) => (
        <input
          ref={(ref) => {
            textInputRef.current[i] = ref;
          }}
          id={`${uuid.current}-${i}`}
          data-id={i}
          autoFocus={autoFocus && i === 0}
          value={value}
          key={`input_${i}`}
          type={type}
          min={0}
          max={9}
          maxLength={input.length === i + 1 ? 1 : input.length}
          style={styles.input}
          autoComplete={autoComplete}
          onFocus={(e) => e.target.select()}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          data-valid={isValid}
          pattern={pattern}
          inputMode={inputMode}
          placeholder={placeholder}
        />
      ))}
    </div>
  );
};

ReactCodeInput.defaultProps = {
  autoComplete: 'off',
  autoFocus: true,
  isValid: true,
  disabled: false,
  forceUppercase: false,
  fields: 4,
  value: '',
  type: 'text',
  filterKeyCodes: [189, 190],
  filterChars: ['-', '.'],
  filterCharsIsWhitelist: false,
};

export default ReactCodeInput;
