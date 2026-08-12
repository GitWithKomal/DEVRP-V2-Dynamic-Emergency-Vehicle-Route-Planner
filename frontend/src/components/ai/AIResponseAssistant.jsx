import {
  FaBrain,
  FaExclamationTriangle,
  FaCheckCircle,
  FaRoute,
} from "react-icons/fa";

function AIResponseAssistant({ analysis, emergencyActive }) {
  if (!analysis) {
    return null;
  }

  const isEmergency = emergencyActive;

  return (
    <section
      className={`dashboard-card ai-card ${
        isEmergency ? "ai-card-active" : ""
      }`}
    >
      <div className="dashboard-card-header">
        <div>
          <span className="card-index">04 / INTELLIGENCE</span>

          <h2>AI Response Assistant</h2>
        </div>

        <span className="ai-badge">AI</span>
      </div>

      <div className="ai-preview">
        <div className={`ai-status-dot ${isEmergency ? "emergency" : ""}`} />

        <div className="ai-content">
          <div className="ai-status-row">
            {isEmergency ? <FaExclamationTriangle /> : <FaBrain />}

            <strong>{analysis.level}</strong>
          </div>

          <h3>{analysis.title}</h3>

          <p>{analysis.message}</p>
        </div>
      </div>

      <div className="ai-recommendation">
        <div className="ai-recommendation-icon">
          <FaRoute />
        </div>

        <div>
          <span>AI RECOMMENDATION</span>

          <p>{analysis.recommendation}</p>
        </div>
      </div>

      <div className="ai-footer">
        <span>
          <FaCheckCircle />
          {analysis.routeStatus}
        </span>

        <span>
          {isEmergency ? "RESPONSE MONITORING" : "INTELLIGENCE STANDBY"}
        </span>
      </div>
    </section>
  );
}

export default AIResponseAssistant;
