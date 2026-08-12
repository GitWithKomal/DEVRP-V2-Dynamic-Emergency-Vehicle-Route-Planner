import {
  FaAmbulance,
  FaCheckCircle,
  FaCircle,
  FaRoute,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

const vehicleLabels = {
  ambulance: "AMBULANCE",
  fire: "FIRE TRUCK",
  police: "POLICE",
};

function DispatchMonitor({
  emergencyActive,
  selectedVehicle = "ambulance",
  routeSummary,
}) {
  const vehicle = vehicleLabels[selectedVehicle] || "EMERGENCY UNIT";

  const hasRoute =
    routeSummary &&
    routeSummary.distance_km !== undefined &&
    routeSummary.duration_min !== undefined;

  return (
    <section
      className={`dashboard-card dispatch-card ${
        emergencyActive ? "dispatch-active" : ""
      }`}
    >
      <div className="dashboard-card-header">
        <div>
          <span className="card-index">05 / DISPATCH</span>

          <h2>Response Monitor</h2>
        </div>

        <span className={`dispatch-badge ${emergencyActive ? "active" : ""}`}>
          <FaCircle />
          {emergencyActive ? "LIVE" : "STANDBY"}
        </span>
      </div>

      <div className="dispatch-status">
        <div
          className={`dispatch-status-icon ${emergencyActive ? "active" : ""}`}
        >
          {emergencyActive ? <FaExclamationTriangle /> : <FaAmbulance />}
        </div>

        <div className="dispatch-status-content">
          <span>RESPONSE STATUS</span>

          <strong>
            {emergencyActive
              ? "PRIORITY DISPATCH ACTIVE"
              : "AWAITING EMERGENCY"}
          </strong>

          <small>
            {emergencyActive
              ? `${vehicle} is assigned to the emergency response.`
              : "Activate SOS to initiate priority response."}
          </small>
        </div>
      </div>

      <div className="dispatch-info-grid">
        <div className="dispatch-info">
          <span>UNIT</span>
          <strong>{vehicle}</strong>
        </div>

        <div className="dispatch-info">
          <span>ROUTE</span>
          <strong>{hasRoute ? "OPTIMIZED" : "NOT SET"}</strong>
        </div>

        <div className="dispatch-info">
          <span>ETA</span>
          <strong>
            {hasRoute ? `${routeSummary.duration_min} MIN` : "--"}
          </strong>
        </div>
      </div>

      <div className="dispatch-timeline">
        <div
          className={`dispatch-step ${
            emergencyActive ? "completed" : "current"
          }`}
        >
          <FaCheckCircle />

          <div>
            <strong>EMERGENCY READY</strong>
            <span>System prepared for response</span>
          </div>
        </div>

        <div className={`dispatch-step ${emergencyActive ? "completed" : ""}`}>
          <FaCheckCircle />

          <div>
            <strong>DISPATCH ACTIVATED</strong>
            <span>
              {emergencyActive
                ? "Priority response initiated"
                : "Awaiting SOS activation"}
            </span>
          </div>
        </div>

        <div className={`dispatch-step ${emergencyActive ? "current" : ""}`}>
          <FaRoute />

          <div>
            <strong>UNIT EN ROUTE</strong>
            <span>
              {emergencyActive
                ? "Following optimized route"
                : "Route monitoring standby"}
            </span>
          </div>
        </div>

        <div className="dispatch-step">
          <FaClock />

          <div>
            <strong>ARRIVAL</strong>
            <span>
              {hasRoute
                ? `Estimated in ${routeSummary.duration_min} minutes`
                : "ETA unavailable"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DispatchMonitor;
