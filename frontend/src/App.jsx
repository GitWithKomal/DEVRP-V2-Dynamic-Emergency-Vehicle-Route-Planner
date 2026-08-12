import { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import MapView from "./components/map/MapView";
import { FaPhoneAlt } from "react-icons/fa";

function App() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const [originPlace, setOriginPlace] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);

  const [routeRequest, setRouteRequest] = useState(null);
  const [routeSummary, setRouteSummary] = useState(null);

  const [activePage, setActivePage] = useState("command");

  const [emergencyActive, setEmergencyActive] = useState(false);
  const [facilityRoute, setFacilityRoute] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("devrp-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("devrp-theme", theme);
  }, [theme]);

  const handleFindRoute = () => {
    if (!originPlace || !destinationPlace) {
      console.warn("Please select both locations from the suggestions.");
      return;
    }

    setRouteRequest({
      origin: originPlace,
      destination: destinationPlace,
    });

    setActivePage("map");
  };

  const handleCurrentLocationSelect = (location) => {
    setOriginPlace({
      latitude: location.latitude,
      longitude: location.longitude,
      eLoc: location.eLoc || null,
      placeName: location.placeName || "Current Location",
      isCurrentLocation: true,
    });

    setOrigin(location.placeName || "Current Location");
  };

  return (
    <div className={`devrp-app ${emergencyActive ? "sos-active" : ""}`}>
      <Navbar
        activePage={activePage}
        onNavigate={setActivePage}
        routeReady={Boolean(routeRequest)}
        onThemeToggle={() =>
          setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark",
          )
        }
      />

      <main className="devrp-main">
        {activePage === "command" && (
          <Home
            origin={origin}
            destination={destination}
            onOriginChange={(value) => {
              setOrigin(value);
              setOriginPlace(null);
            }}
            onDestinationChange={(value) => {
              setDestination(value);
              setDestinationPlace(null);
            }}
            routeSummary={routeSummary}
            onOriginSelect={setOriginPlace}
            currentLocation={originPlace}
            onDestinationSelect={setDestinationPlace}
            onCurrentLocationSelect={handleCurrentLocationSelect}
            onFindRoute={handleFindRoute}
            emergencyActive={emergencyActive}
            onEmergencyChange={setEmergencyActive}
            onNavigate={setActivePage}
            onFacilityRouteCalculated={setFacilityRoute}
          />
        )}

        {activePage === "map" && (
          <section className="map-page">
            <MapView
              routeRequest={routeRequest}
              facilityRoute={facilityRoute}
              onRouteCalculated={(data) => {
                setRouteSummary(data);
              }}
            />
          </section>
        )}

        {activePage === "contacts" && (
          <section className="contacts-page">
            <div className="contacts-header">
              <div>
                <span className="panel-tag">QUICK DIAL</span>

                <h1>Emergency Contacts</h1>

                <p>Emergency communication services for rapid response.</p>
              </div>

              <div className="contacts-status">
                <span className="status-indicator" />
                SERVICES AVAILABLE
              </div>
            </div>

            <div className="contacts-grid">
              <button
                type="button"
                className="contact-card primary"
                onClick={() => {
                  alert("Emergency call ready: 112");
                }}
              >
                <div className="contact-icon">🚨</div>

                <div className="contact-info">
                  <span>UNIFIED EMERGENCY</span>
                  <strong>112</strong>
                  <small>Police • Fire • Ambulance</small>
                </div>

                <span className="contact-action">
                  <FaPhoneAlt />
                  CALL
                </span>
              </button>

              <button
                type="button"
                className="contact-card"
                onClick={() => {
                  alert("Emergency call ready: 108");
                }}
              >
                <div className="contact-icon">🚑</div>

                <div className="contact-info">
                  <span>MEDICAL RESPONSE</span>
                  <strong>108</strong>
                  <small>Emergency Ambulance</small>
                </div>

                <span className="contact-action">
                  <FaPhoneAlt />
                  CALL
                </span>
              </button>

              <button
                type="button"
                className="contact-card"
                onClick={() => {
                  alert("Emergency call ready: 101");
                }}
              >
                <div className="contact-icon">🔥</div>

                <div className="contact-info">
                  <span>FIRE & RESCUE</span>
                  <strong>101</strong>
                  <small>Fire and rescue services</small>
                </div>

                <span className="contact-action">
                  <FaPhoneAlt />
                  CALL
                </span>
              </button>

              <button
                type="button"
                className="contact-card"
                onClick={() => {
                  alert("Emergency call ready: 100");
                }}
              >
                <div className="contact-icon">🛡</div>

                <div className="contact-info">
                  <span>LAW ENFORCEMENT</span>
                  <strong>100</strong>
                  <small>Police emergency response</small>
                </div>

                <span className="contact-action">
                  <FaPhoneAlt />
                  CALL
                </span>
              </button>
            </div>

            <div className="contacts-note">
              <strong>Emergency response</strong>

              <span>
                Use the appropriate service number or call 112 for unified
                emergency assistance.
              </span>
            </div>
          </section>
        )}

        {activePage === "about" && (
          <section className="about-page">
            <div className="about-container">
              <div className="about-header">
                <div>
                  <span className="panel-tag">PLATFORM INFO</span>

                  <h1>DEVRP COMMAND SYSTEM</h1>

                  <p>Dynamic Emergency Vehicle Route Planner</p>
                </div>

                <div className="about-status">
                  <span className="status-indicator" />
                  SYSTEM OPERATIONAL
                </div>
              </div>

              <section className="about-card about-intro">
                <span className="card-index">01 / OVERVIEW</span>

                <h2>Emergency Routing, Simplified.</h2>

                <p>
                  DEVRP is an emergency vehicle route planning application
                  designed to help response teams identify efficient routes
                  between an origin and destination.
                </p>

                <p>
                  The system combines location selection, route calculation,
                  emergency vehicle selection and response analysis into a
                  single command interface.
                </p>
              </section>

              <section className="about-card">
                <span className="card-index">02 / RESPONSE WORKFLOW</span>

                <h2>How DEVRP Works</h2>

                <div className="workflow-grid">
                  <div className="workflow-step">
                    <span className="workflow-number">01</span>

                    <div>
                      <strong>Select Unit</strong>

                      <p>
                        Choose the emergency response vehicle required for the
                        situation.
                      </p>
                    </div>
                  </div>

                  <div className="workflow-step">
                    <span className="workflow-number">02</span>

                    <div>
                      <strong>Configure Route</strong>

                      <p>
                        Select the origin and destination using location
                        suggestions.
                      </p>
                    </div>
                  </div>

                  <div className="workflow-step">
                    <span className="workflow-number">03</span>

                    <div>
                      <strong>Calculate Route</strong>

                      <p>
                        The backend processes the selected locations and returns
                        the calculated route.
                      </p>
                    </div>
                  </div>

                  <div className="workflow-step">
                    <span className="workflow-number">04</span>

                    <div>
                      <strong>Monitor Response</strong>

                      <p>
                        Distance, ETA, route status and emergency response
                        information are displayed to the operator.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="about-card">
                <span className="card-index">03 / SYSTEM CAPABILITIES</span>

                <h2>Built for Emergency Response</h2>

                <div className="capability-grid">
                  <div className="capability-item">
                    <strong>Dynamic Routing</strong>
                    <span> Calculate routes between selected locations.</span>
                  </div>

                  <div className="capability-item">
                    <strong>Emergency Units</strong>
                    <span>
                      Support ambulance, fire and police response units.
                    </span>
                  </div>

                  <div className="capability-item">
                    <strong>Route Intelligence</strong>
                    <span>
                      Provide distance, ETA and response recommendations.
                    </span>
                  </div>

                  <div className="capability-item">
                    <strong>Live Navigation</strong>
                    <span>
                      {" "}
                      Display the calculated route directly on the map.
                    </span>
                  </div>

                  <div className="capability-item">
                    <strong>Priority Response</strong>
                    <span> Activate emergency mode for priority dispatch.</span>
                  </div>

                  <div className="capability-item">
                    <strong>Quick Emergency Access</strong>
                    <span>
                      {" "}
                      Provide direct access to emergency contact services.
                    </span>
                  </div>
                </div>
              </section>

              <div className="about-footer">
                <span>DEVRP</span>
                <span>EMERGENCY ROUTE PLANNING PLATFORM</span>
                <span>COMMAND SYSTEM</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
