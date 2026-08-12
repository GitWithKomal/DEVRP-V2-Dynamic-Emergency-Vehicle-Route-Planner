import {
  FaCompass,
  FaMap,
  FaPhoneAlt,
  FaInfoCircle,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const navItems = [
  {
    id: "command",
    label: "Command",
    icon: FaCompass,
  },
  {
    id: "map",
    label: "Map",
    icon: FaMap,
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: FaPhoneAlt,
  },
  {
    id: "about",
    label: "About",
    icon: FaInfoCircle,
  },
];

function Navbar({ activePage, onNavigate, routeReady, theme,
  onThemeToggle, }) {
  return (
    <nav className="devrp-navbar">
      <div className="navbar-inner">
        <ul className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive = activePage === item.id;

            const isMapDisabled =
              item.id === "map" && !routeReady;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`nav-link ${
                    isActive ? "active" : ""
                  } ${isMapDisabled ? "disabled" : ""}`}
                  onClick={() => {
                    if (!isMapDisabled) {
                      onNavigate(item.id);
                    }
                  }}
                  disabled={isMapDisabled}
                >
                  <Icon />
                  <span>{item.label}</span>

                  {item.id === "map" && routeReady && (
                    <span className="nav-route-indicator" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="nav-badge">
          <span className="nav-region">
            📡 NAGPUR REGION
          </span>
        </div>
        <button
  type="button"
  className="theme-toggle"
  onClick={onThemeToggle}
  aria-label={
    theme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme"
  }
  title={
    theme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme"
  }
>
  {theme === "dark" ? <FaSun /> : <FaMoon />}
</button>
      </div>
    </nav>
  );
}

export default Navbar;