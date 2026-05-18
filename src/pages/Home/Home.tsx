import { IonContent, IonPage, IonToast } from '@ionic/react';
import { useState } from 'react';
import { LeadForm } from '../../components/LeadForm/LeadForm';
import styles from './Home.module.css';

export default function Home() {
  const [toastMessage, setToastMessage] = useState<string | undefined>(undefined);
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  return (
    <IonPage>
      <IonContent fullscreen className={styles.content}>
        <div className={styles.background} />

        <main className={styles.main}>
          <img className={styles.logo} src="/logo.png" alt="Cuban Cigar Factory" />

          <section className={styles.card}>
            <h1 className={styles.title}>
              Get <span className={styles.titleAccent}>10% OFF</span> Coupon when you join our mailing list*
            </h1>
            <div className={styles.note}>*Only one per customer.</div>

            <LeadForm
              onSuccess={() => {
                setToastColor('success');
                setToastMessage('Thanks! Your coupon request was received.');
              }}
              onError={(message) => {
                setToastColor('danger');
                setToastMessage(message);
              }}
            />
          </section>
        </main>

        <IonToast
          isOpen={Boolean(toastMessage)}
          message={toastMessage}
          color={toastColor}
          duration={3200}
          position="bottom"
          onDidDismiss={() => setToastMessage(undefined)}
        />
      </IonContent>
    </IonPage>
  );
}
