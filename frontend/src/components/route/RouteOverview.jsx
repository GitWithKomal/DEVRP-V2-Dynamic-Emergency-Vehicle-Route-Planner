import {
  FaRoute,
  FaClock,
  FaMapMarkerAlt,
  FaFlagCheckered,
  FaCircle,
} from "react-icons/fa";

function RouteOverview({ routeSummary, selectedVehicle }) {
  if (!routeSummary) {
    return (
      <section className="route-overview">
        <div className="section-heading">
          LIVE ROUTE OVERVIEW
        </div>

        <div className="route-empty">
          <FaRoute />

          <div>
            <strong>NO ACTIVE ROUTE</strong>
            <span>
              Configure origin and destination to begin navigation.
            </span>
          </div>
        </div>
      </section>
    );
  }

  const vehicleNames = {
    ambulance: "AMBULANCE",
    fire: "FIRE TRUCK",
    police: "POLICE",
  };

  return (
    <section className="route-overview">
      <div className="route-overview-header">
        <div>
          <div className="section-heading">
            LIVE ROUTE OVERVIEW
          </div>

          <div className="route-status">
            <FaCircle />
            ROUTE ACTIVE
          </div>
        </div>

        <div className="route-unit">
          {vehicleNames[selectedVehicle] || "EMERGENCY UNIT"}
        </div>
      </div>

      <div className="route-metrics">
        <div className="route-metric">
          <FaRoute />

          <div>
            <strong>
              {routeSummary.distance_km} KM
            </strong>

            <span>DISTANCE</span>
          </div>
        </div>

        <div className="route-metric">
          <FaClock />

          <div>
            <strong>
              {routeSummary.duration_min} MIN
            </strong>

            <span>EST. ETA</span>
          </div>
        </div>
      </div>

      <div className="route-path">

        <div className="route-location">
          <FaMapMarkerAlt />

          <div>
            <span>ORIGIN</span>

            <strong>
              {routeSummary.originName || "Selected origin"}
            </strong>
          </div>
        </div>

        <div className="route-line" />

        <div className="route-location">
          <FaFlagCheckered />

          <div>
            <span>DESTINATION</span>

            <strong>
              {routeSummary.destinationName ||
                "Selected destination"}
            </strong>
          </div>
        </div>

      </div>
    </section>
  );
}

export default RouteOverview;