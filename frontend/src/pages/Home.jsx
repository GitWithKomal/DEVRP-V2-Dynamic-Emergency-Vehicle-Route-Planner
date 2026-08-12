import { useEffect, useMemo, useRef, useState } from "react";

import VehicleSelector from "../components/vehicle/VehicleSelector";
import RouteConfiguration from "../components/route/RouteConfiguration";
import LiveRouteOverview from "../components/route/LiveRouteOverview";
import SOSButton from "../components/emergency/SOSButton";
import AIResponseAssistant from "../components/ai/AIResponseAssistant";
import { generateResponseAnalysis } from "../utils/responseEngine";
import DispatchMonitor from "../components/emergency/DispatchMonitor";
import NearbyServices from "../components/emergency/NearbyServices";

function Home({
  origin,
  destination,
  currentLocation,
  onOriginChange,
  onDestinationChange,
  onCurrentLocationSelect,
  onOriginSelect,
  onDestinationSelect,
  onFindRoute,
  routeSummary,
  emergencyActive,
  onEmergencyChange,
  onNavigate,
  onFacilityRouteCalculated,
}) {
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
  const [selectedVehicle, setSelectedVehicle] = useState("ambulance");

  const nearbyServicesRef = useRef(null);
  useEffect(() => {
    if (!emergencyActive) {
      return;
    }

    const timer = setTimeout(() => {
      nearbyServicesRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [emergencyActive]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(`${API_URL}/api/location/reverse`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude,
              longitude,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(
              data.error || "Unable to resolve current location.",
            );
          }

          const location = data.location;

          if (onCurrentLocationSelect) {
            onCurrentLocationSelect(location);
          }
        } catch (error) {
          console.error("Current location lookup failed:", error);
        }
      },
      (error) => {
        console.error("Unable to get current location:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const responseAnalysis = useMemo(
    () =>
      generateResponseAnalysis({
        selectedVehicle,
        routeSummary,
        emergencyActive,
        origin,
        destination,
      }),
    [selectedVehicle, routeSummary, emergencyActive, origin, destination],
  );

  return (
    <div className="command-page">
      <div className="command-header">
        <div>
          <span className="command-eyebrow">EMERGENCY DISPATCH SYSTEM</span>

          <h1 className="command-title">DEVRP COMMAND CENTER</h1>

          <p className="command-subtitle">
            Dynamic Emergency Vehicle Route Planner
          </p>
        </div>

        <div
          className={`command-system-status ${
            emergencyActive ? "emergency" : ""
          }`}
        >
          <span className="status-indicator" />

          <div>
            <strong>
              {emergencyActive ? "EMERGENCY ACTIVE" : "SYSTEM ACTIVE"}
            </strong>

            <small>
              {emergencyActive
                ? "PRIORITY RESPONSE PROTOCOL ENGAGED"
                : "ALL SERVICES OPERATIONAL"}
            </small>
          </div>

          <SOSButton onEmergencyActivate={onEmergencyChange} />
        </div>
      </div>

      <div className="command-grid">
        <div className="command-left">
          <section className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <span className="card-index">01 / RESPONSE UNIT</span>

                <h2>Emergency Unit</h2>
              </div>
            </div>

            <VehicleSelector
              selectedVehicle={selectedVehicle}
              onVehicleChange={setSelectedVehicle}
            />
          </section>

          <section className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <span className="card-index">02 / ROUTING</span>

                <h2>Route Configuration</h2>
              </div>
            </div>

            <RouteConfiguration
              origin={origin}
              destination={destination}
              onOriginChange={onOriginChange}
              onDestinationChange={onDestinationChange}
              onOriginSelect={onOriginSelect}
              onDestinationSelect={onDestinationSelect}
              onCurrentLocation={handleCurrentLocation}
              onFindRoute={onFindRoute}
            />
          </section>
        </div>

        <div className="command-right">
          <LiveRouteOverview
            routeSummary={routeSummary}
            selectedVehicle={selectedVehicle}
            origin={origin}
            destination={destination}
            emergencyActive={emergencyActive}
          />

          <AIResponseAssistant
            analysis={responseAnalysis}
            emergencyActive={emergencyActive}
          />

          <DispatchMonitor
            emergencyActive={emergencyActive}
            selectedVehicle={selectedVehicle}
            routeSummary={routeSummary}
          />

          {emergencyActive && (
            <div className="emergency-services-indicator">
              <span className="emergency-indicator-dot" />
              <div>
                <strong>EMERGENCY SERVICES AVAILABLE</strong>
                <small>
                  Nearby response facilities detected for your current location
                </small>
              </div>
              <span className="emergency-indicator-arrow">↓</span>
            </div>
          )}

          <div ref={nearbyServicesRef} className="emergency-services-anchor">
            <NearbyServices
              emergencyActive={emergencyActive}
              selectedVehicle={selectedVehicle}
              currentLocation={currentLocation}
              onFacilityRouteCalculated={onFacilityRouteCalculated}
            />
          </div>
        </div>
      </div>

      <div className="operations-grid">
        <div
          className="operation-card"
          onClick={() => onNavigate("contacts")}
          role="button"
          tabIndex={0}
        >
          <span className="operation-icon">☎</span>

          <div>
            <span className="card-index">QUICK DIAL</span>

            <strong>Emergency Contacts</strong>

            <small>Access emergency communication services</small>
          </div>
        </div>

        <div className="operation-card">
          <span className="operation-icon">⚡</span>

          <div>
            <span className="card-index">RESPONSE</span>

            <strong>Rapid Deployment</strong>

            <small>Optimized routing for emergency vehicles</small>
          </div>
        </div>

        <div className="operation-card">
          <span className="operation-icon">◉</span>

          <div>
            <span className="card-index">NETWORK</span>

            <strong>Mappls Navigation</strong>

            <small>Real-time location and route services</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
