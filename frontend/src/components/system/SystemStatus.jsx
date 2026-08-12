import { useEffect, useState } from "react";
import {
  FaCircle,
  FaClock,
  FaWifi,
  FaShieldAlt,
} from "react-icons/fa";

function SystemStatus() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <section className="system-status-panel">

      <div className="system-status-main">

        <div className="system-indicator active">
          <FaCircle />
        </div>

        <div className="system-status-text">
          <span className="system-label">
            SYSTEM STATUS
          </span>

          <strong>
            SYSTEM ACTIVE
          </strong>
        </div>

      </div>

      <div className="system-status-items">

        <div className="system-status-item">
          <FaWifi />

          <div>
            <span>NETWORK</span>
            <strong>ONLINE</strong>
          </div>
        </div>

        <div className="system-status-item">
          <FaShieldAlt />

          <div>
            <span>SECURITY</span>
            <strong>PROTECTED</strong>
          </div>
        </div>

        <div className="system-clock">
          <FaClock />

          <div>
            <span>LOCAL TIME</span>
            <strong>{formattedTime}</strong>
          </div>
        </div>

      </div>

    </section>
  );
}

export default SystemStatus;