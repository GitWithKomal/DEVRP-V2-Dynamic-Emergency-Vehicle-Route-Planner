import { useState } from "react";
import { FaExclamationTriangle, FaTimes, FaPhoneAlt } from "react-icons/fa";

function SOSButton({ onEmergencyActivate }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [active, setActive] = useState(false);

  const handleActivate = () => {
    setActive(true);
    setShowConfirm(false);

    if (onEmergencyActivate) {
      onEmergencyActivate(true);
    }
  };

  const handleCancel = () => {
    setActive(false);

    if (onEmergencyActivate) {
      onEmergencyActivate(false);
    }
  };

  if (active) {
    return (
      <div className="sos-active-panel">
        <div className="sos-active-header">
          <div className="sos-active-icon">
            <FaExclamationTriangle />
          </div>

          <div className="sos-active-content">
            <span className="sos-active-label">EMERGENCY MODE ACTIVE</span>

            <strong>EMERGENCY RESPONSE INITIATED</strong>

            <small>Priority routing and response systems engaged.</small>
          </div>
        </div>

        <div className="sos-active-status">
          <span className="sos-pulse-dot" />
          <span>DISPATCH SYSTEM ACTIVE</span>
        </div>

        <div className="sos-active-actions">
          <button
            type="button"
            className="sos-call-btn"
            onClick={() => {
              window.location.href = "tel:112";
            }}
          >
            <FaPhoneAlt />
            CALL 112
          </button>

          <button
            type="button"
            className="sos-cancel-btn"
            onClick={handleCancel}
          >
            <FaTimes />
            CANCEL EMERGENCY
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="sos-button"
        onClick={() => setShowConfirm(true)}
      >
        <FaExclamationTriangle />

        <span className="sos-button-content">
          <strong>SOS</strong>
          <small>EMERGENCY RESPONSE</small>
        </span>
      </button>

      {showConfirm && (
        <div className="sos-confirm-overlay">
          <div className="sos-confirm-modal">
            <div className="sos-modal-icon">
              <FaExclamationTriangle />
            </div>

            <span className="card-index">EMERGENCY PROTOCOL</span>

            <h2>Activate Emergency Mode?</h2>

            <p>
              This will activate priority emergency response mode and prepare
              the system for immediate dispatch.
            </p>

            <div className="sos-modal-actions">
              <button
                type="button"
                className="sos-confirm-btn"
                onClick={handleActivate}
              >
                ACTIVATE SOS
              </button>

              <button
                type="button"
                className="sos-dismiss-btn"
                onClick={() => setShowConfirm(false)}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SOSButton;
