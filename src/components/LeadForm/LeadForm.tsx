import { IonButton, IonLabel, IonSegment, IonSegmentButton, IonSpinner, IonText } from '@ionic/react';
import { useMemo, useState } from 'react';
import type { Lead, LeadFieldErrors, SanDiegoLocalAnswer } from '../../types/lead';
import { createGoHighLevelContact } from '../../services/goHighLevelService';
import { validateLead } from '../../utils/validators';
import { FormInput } from '../FormInput/FormInput';
import styles from './LeadForm.module.css';

const EMPTY_LEAD: Lead = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  isSanDiegoLocal: '',
};

type Props = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function LeadForm({ onSuccess, onError }: Props) {
  const [lead, setLead] = useState<Lead>(EMPTY_LEAD);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting]);

  async function handleSubmit() {
    const nextErrors = validateLead(lead);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await createGoHighLevelContact(lead);
      setLead(EMPTY_LEAD);
      setErrors({});
      onSuccess?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      onError?.(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={styles.form}
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <div className={styles.grid}>
        <FormInput
          label="First Name"
          value={lead.firstName}
          onChange={(value) => setLead((prev) => ({ ...prev, firstName: value }))}
          placeholder="John"
          required
          disabled={isSubmitting}
          error={errors.firstName}
        />

        <FormInput
          label="Last Name"
          value={lead.lastName}
          onChange={(value) => setLead((prev) => ({ ...prev, lastName: value }))}
          placeholder="Doe"
          required
          disabled={isSubmitting}
          error={errors.lastName}
        />
      </div>

      <FormInput
        label="Email"
        value={lead.email}
        onChange={(value) => setLead((prev) => ({ ...prev, email: value }))}
        placeholder="john.doe@email.com"
        type="email"
        inputMode="email"
        required
        disabled={isSubmitting}
        error={errors.email}
      />

      <FormInput
        label="Phone"
        value={lead.phone}
        onChange={(value) => {
          let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
          if (!x) return setLead((prev) => ({ ...prev, phone: '' }));
          let formatted = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
          setLead((prev) => ({ ...prev, phone: formatted }));
        }}
        placeholder="(619) 555-0123"
        type="tel"
        inputMode="tel"
        required
        disabled={isSubmitting}
        error={errors.phone}
      />

      <div className={styles.radioBlock}>
        <div className={styles.radioLabel}>Are you a San Diego Local?</div>
        <IonSegment
          value={lead.isSanDiegoLocal}
          className={styles.segment}
          disabled={isSubmitting}
          onIonChange={(e) => {
            const value = e.detail.value;
            const next = value === 'yes' || value === 'no' ? (value as SanDiegoLocalAnswer) : '';
            setLead((prev) => ({ ...prev, isSanDiegoLocal: next }));
          }}
        >
          <IonSegmentButton value="yes">
            <IonLabel>Yes</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="no">
            <IonLabel>No</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {errors.isSanDiegoLocal ? (
          <IonText color="danger" className={styles.radioError}>
            {errors.isSanDiegoLocal}
          </IonText>
        ) : null}
      </div>

      <IonButton type="submit" expand="block" className={styles.submit} disabled={!canSubmit}>
        {isSubmitting ? <IonSpinner name="crescent" className={styles.spinner} /> : null}
        <span>Get My Coupon</span>
      </IonButton>
    </form>
  );
}
