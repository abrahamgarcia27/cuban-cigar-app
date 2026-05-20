import { IonInput, IonItem, IonLabel, IonText } from '@ionic/react';
import type { AutocompleteTypes, TextFieldTypes } from '@ionic/core';
import type React from 'react';
import styles from './FormInput.module.css';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: TextFieldTypes;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autocomplete?: AutocompleteTypes;
  required?: boolean;
  disabled?: boolean;
  error?: string;
};

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  autocomplete = 'off',
  required = false,
  disabled = false,
  error,
}: Props) {
  const hasError = Boolean(error);

  return (
    <div className={styles.field}>
      <IonItem className={`${styles.item} ${hasError ? styles.itemError : ''}`} lines="none">
        <IonLabel position="stacked">
          {label}
          {required ? <span className={styles.required}> *</span> : null}
        </IonLabel>
        <IonInput
          value={value}
          placeholder={placeholder}
          type={type}
          inputMode={inputMode}
          autocomplete={autocomplete}
          disabled={disabled}
          onIonInput={(e) => onChange(e.detail.value ?? '')}
        />
      </IonItem>
      {hasError ? (
        <IonText color="danger" className={styles.errorText}>
          {error}
        </IonText>
      ) : null}
    </div>
  );
}
