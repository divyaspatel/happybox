import React, { useState } from 'react';

export default function DeleteConfirmModal({ onConfirm, onCancel }) {
  const [step, setStep] = useState(1); // 1 = first question, 2 = second question

  const handleFirstYes = () => {
    setStep(2);
  };

  const handleSecondYes = () => {
    onConfirm();
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <div className="modal-emoji">🗑️</div>
            <h3 className="modal-title">Do you want to delete this note?</h3>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={onCancel}>No, keep it</button>
              <button className="btn btn-danger" onClick={handleFirstYes}>Yes, delete</button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-emoji">⚠️</div>
            <h3 className="modal-title">Are you sure you want to delete this note?</h3>
            <p className="modal-subtitle">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={onCancel}>No, keep it</button>
              <button className="btn btn-danger" onClick={handleSecondYes}>Yes, I'm sure</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
