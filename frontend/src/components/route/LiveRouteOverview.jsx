import {
  FaMapMarkedAlt,
  FaRoute,
  FaClock,
  FaAmbulance,
  FaFireAlt,
  FaShieldAlt,
  FaCircle,
} from "react-icons/fa";

const vehicleInfo = {
  ambulance: {
    label: "AMBULANCE",
    icon: FaAmbulance,
  },
  fire: {
    label: "FIRE TRUCK",
    icon: FaFireAlt,
  },
  police: {
    label: "POLICE",
    icon: FaShieldAlt,
  },
};

function LiveRouteOverview({
  routeSummary,
  selectedVehicle = "ambulance",
  origin,
  destination,
  emergencyActive,
}) {
  const vehicle = vehicleInfo[selectedVehicle] || vehicleInfo.ambulance;

  const VehicleIcon = vehicle.icon;

  const hasRoute =
    routeSummary &&
    routeSummary.distance_km !== undefined &&
    routeSummary.duration_min !== undefined;

  return (
    <section className="live-route-panel">
      <div className="panel-header">
        <div>
          <span className="panel-index">03 / NAVIGATION</span>

          <h2>Live Route Overview</h2>
        </div>

        <div className="route-live-badge">
          <FaCircle />
          LIVE
        </div>
      </div>

      <div className="route-visual">
        {!hasRoute ? (
          <div className="route-empty-state">
            <FaMapMarkedAlt className="route-empty-icon" />

            <h3>Map Navigation Ready</h3>

            <p>
              Configure origin and destination to calculate the fastest
              emergency route.
            </p>
          </div>
        ) : (
          <div className="route-active-state">
            <div className="route-endpoints">
              <div className="route-point origin-point">
                <span className="route-point-marker">A</span>

                <div>
                  <span>ORIGIN</span>

                  <strong>{origin || "Selected location"}</strong>
                </div>
              </div>

              <div className="route-line">
                <FaRoute />
              </div>

              <div className="route-point destination-point">
                <span className="route-point-marker">B</span>

                <div>
                  <span>DESTINATION</span>

                  <strong>{destination || "Selected destination"}</strong>
                </div>
              </div>
            </div>

            <div className="route-active-label">
              <FaCircle />
              <span
                className={`route-status ${emergencyActive ? "emergency" : ""}`}
              >
                {emergencyActive ? "EMERGENCY ACTIVE" : "ROUTE ACTIVE"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="route-metrics">
        <div className="route-metric">
          <FaRoute />

          <div>
            <span>DISTANCE</span>

            <strong>
              {hasRoute ? `${routeSummary.distance_km} km` : "---"}
            </strong>
          </div>
        </div>

        <div className="route-metric">
          <FaClock />

          <div>
            <span>ETA</span>

            <strong>
              {hasRoute ? `${routeSummary.duration_min} min` : "---"}
            </strong>
          </div>
        </div>

        <div className="route-metric">
          <VehicleIcon />

          <div>
            <span>UNIT</span>

            <strong>{vehicle.label}</strong>
          </div>
        </div>

        <div className="route-metric">
          <FaCircle />

          <div>
            <span>STATUS</span>

            <strong
              className={
                hasRoute
                  ? emergencyActive
                    ? "status-emergency"
                    : "status-active"
                  : ""
              }
            >
              {hasRoute
                ? emergencyActive
                  ? "PRIORITY DISPATCH"
                  : "ROUTE ACTIVE"
                : "READY"}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveRouteOverview;
