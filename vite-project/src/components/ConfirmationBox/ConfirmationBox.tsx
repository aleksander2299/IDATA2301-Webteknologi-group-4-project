import ConfirmationBoxstyle from './ConfirmationBox.module.css';

interface ConfirmationBoxProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationBox({ onConfirm, onCancel }: ConfirmationBoxProps) {
  return (
    <div className={ConfirmationBoxstyle.modalOverlay}>
      <div className={ConfirmationBoxstyle.modalContent}>
        <div className={ConfirmationBoxstyle.confirmationBoxContainer}>
          <h1 className={ConfirmationBoxstyle.h1}>Are you sure you want to book this room?</h1>
          <div className={ConfirmationBoxstyle.buttonRow}>
            <button className={ConfirmationBoxstyle.button} onClick={onConfirm}>Yes</button>
            <button className={ConfirmationBoxstyle.button} onClick={onCancel}>No</button>
          </div>
          <h2 className={ConfirmationBoxstyle.h2}><em>NOTE: refunds are not available less than 24h before check-in.</em></h2>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationBox;
