import { useEffect, useState } from "react";
import { FaCog, FaAmbulance } from "react-icons/fa";

function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour12: false,
  });

  return (
    <header className="devrp-header">
      <div className="header-brand">
        <div className="header-emblem">
          <span className="emblem-ring" />

          <FaAmbulance className="emblem-icon" />
        </div>

        <div className="header-brand-text">
          <span className="header-label">DYNAMIC EMERGENCY</span>

          <span className="header-sub">VEHICLE ROUTE PLANNER</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-clock-block">
          <span className="clock-label">LOCAL TIME</span>

          <span className="live-clock">{formattedTime}</span>
        </div>

        <button
          type="button"
          className="theme-btn"
          aria-label="System settings"
          title="System settings"
        >
          <FaCog />
        </button>
      </div>
    </header>
  );
}

export default Header;
