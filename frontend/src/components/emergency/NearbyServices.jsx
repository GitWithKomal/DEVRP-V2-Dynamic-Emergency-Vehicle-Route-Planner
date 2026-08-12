import { useEffect, useState } from "react";
import {
  FaAmbulance,
  FaFire,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaSpinner,
  FaRoute,
  FaCheckCircle,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const serviceConfig = {
  ambulance: {
    title: "Nearby Hospitals",
    label: "MEDICAL FACILITIES",
    icon: FaAmbulance,
  },
  fire: {
    title: "Nearby Fire Stations",
    label: "FIRE RESPONSE FACILITIES",
    icon: FaFire,
  },
  police: {
    title: "Nearby Police Stations",
    label: "LAW ENFORCEMENT FACILITIES",
    icon: FaShieldAlt,
  },
};

function NearbyServices({
  emergencyActive,
  selectedVehicle = "ambulance",
  currentLocation,
  onFacilityRouteCalculated,
}) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedService, setSelectedService] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [facilityRoute, setFacilityRoute] = useState(null);

  const config = serviceConfig[selectedVehicle] || serviceConfig.ambulance;

  const ServiceIcon = config.icon;

  useEffect(() => {
    if (!emergencyActive || !currentLocation) {
      setServices([]);
      setSelectedService(null);
      setFacilityRoute(null);
      setError("");
      return;
    }

    const fetchNearbyServices = async () => {
      if (
        currentLocation.latitude == null ||
        currentLocation.longitude == null
      ) {
        setError("Current location is unavailable.");
        return;
      }

      setLoading(true);
      setError("");
      setSelectedService(null);
      setFacilityRoute(null);

      try {
        const response = await fetch(`${API_URL}/api/nearby-services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            serviceType: selectedVehicle,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Unable to find nearby services.");
        }

        setServices(data.services || []);
      } catch (error) {
        console.error("Nearby services error:", error);

        setError(error.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyServices();
  }, [emergencyActive, selectedVehicle, currentLocation]);

  const handleSelectFacility = async (service) => {
    if (!currentLocation) {
      console.warn("Current location is missing.");
      return;
    }

    setSelectedService(service);
    setRouteLoading(true);
    setRouteError("");
    setFacilityRoute(null);

    try {
      if (!service.eLoc) {
        throw new Error("Route location is unavailable for this facility.");
      }

      const response = await fetch(`${API_URL}/api/route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: `${currentLocation.longitude},${currentLocation.latitude}`,
          destination: service.eLoc,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to calculate facility route.");
      }

      setFacilityRoute(data);

      if (onFacilityRouteCalculated) {
        onFacilityRouteCalculated({
          ...data,
          facility: service,
        });
      }
    } catch (error) {
      console.error("Facility route error:", error);

      setRouteError(error.message || "Unable to calculate facility route.");
    } finally {
      setRouteLoading(false);
    }
  };

  return (
    <section className="dashboard-card nearby-services-card">
      <div className="dashboard-card-header">
        <div>
          <span className="card-index">06 / LOCAL RESPONSE</span>

          <h2>{config.title}</h2>
        </div>

        <span className="nearby-service-badge">LIVE SEARCH</span>
      </div>

      <div className="nearby-services-status">
        <ServiceIcon />

        <div>
          <strong>{config.label}</strong>

          <small>Searching near your current location</small>
        </div>
      </div>

      {loading && (
        <div className="nearby-services-loading">
          <FaSpinner className="nearby-spinner" />

          <span>Finding nearby emergency facilities...</span>
        </div>
      )}

      {error && !loading && (
        <div className="nearby-services-error">{error}</div>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="nearby-services-empty">
          No nearby facilities were found.
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="nearby-services-list">
          {services.map((service, index) => {
            const isSelected = selectedService?.eLoc === service.eLoc;

            return (
              <div
                className={`nearby-service-item ${
                  isSelected ? "selected" : ""
                }`}
                key={service.eLoc || `${service.name}-${index}`}
              >
                <div className="nearby-service-icon">
                  <ServiceIcon />
                </div>

                <div className="nearby-service-info">
                  <strong>{service.name}</strong>

                  <span>
                    <FaMapMarkerAlt />

                    {service.address || "Address unavailable"}
                  </span>
                </div>

                <div className="nearby-service-distance">
                  <strong>
                    {service.distance_km != null
                      ? `${service.distance_km} km`
                      : "--"}
                  </strong>

                  <small>NEARBY</small>
                </div>

                <button
                  type="button"
                  className={`nearby-select-btn ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => {
                    handleSelectFacility(service);
                  }}
                  disabled={routeLoading}
                >
                  {isSelected ? (
                    <>
                      <FaCheckCircle />
                      SELECTED
                    </>
                  ) : (
                    <>
                      <FaRoute />
                      SELECT
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {routeLoading && (
        <div className="nearby-route-loading">
          <FaSpinner className="nearby-spinner" />

          <span>Calculating response route...</span>
        </div>
      )}

      {routeError && !routeLoading && (
        <div className="nearby-services-error">{routeError}</div>
      )}

      {facilityRoute && selectedService && (
        <div className="selected-facility-panel">
          <div className="selected-facility-header">
            <div>
              <span>SELECTED RESPONSE FACILITY</span>

              <strong>{selectedService.name}</strong>
            </div>

            <FaCheckCircle />
          </div>

          <div className="selected-facility-route">
            <div>
              <FaRoute />

              <strong>{facilityRoute.distance_km} KM</strong>

              <small>DRIVING DISTANCE</small>
            </div>

            <div>
              <FaSpinner />

              <strong>{facilityRoute.duration_min} MIN</strong>

              <small>ESTIMATED ETA</small>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default NearbyServices;
