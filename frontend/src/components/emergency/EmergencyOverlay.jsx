import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

function EmergencyOverlay({ onClose }) {
  return (
    <div className="emergency-overlay">
      <div className="emergency-alert">
        <div className="emergency-alert-icon">
          <FaExclamationTriangle />
        </div>

        <div className="emergency-alert-content">
          <span className="emergency-label">CRITICAL ALERT</span>

          <h2>Emergency Response Activated</h2>

          <p>
            SOS protocol has been initiated. Emergency routing and response
            systems are now active.
          </p>

          <div className="emergency-status">
            <span />
            SYSTEM PRIORITY: CRITICAL
          </div>
        </div>

        <button
          type="button"
          className="emergency-close"
          onClick={onClose}
          aria-label="Close emergency alert"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

export default EmergencyOverlay;
