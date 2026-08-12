import {
  FaAmbulance,
  FaFireAlt,
  FaShieldAlt,
} from "react-icons/fa";

const vehicles = [
  {
    id: "ambulance",
    label: "Ambulance",
    icon: FaAmbulance,
    description: "Medical Emergency",
  },
  {
    id: "fire",
    label: "Fire Truck",
    icon: FaFireAlt,
    description: "Fire & Rescue",
  },
  {
    id: "police",
    label: "Police",
    icon: FaShieldAlt,
    description: "Law Enforcement",
  },
];

function VehicleSelector({
  selectedVehicle,
  onVehicleChange,
}) {
  return (
    <section className="vehicle-selector">
      <div className="field-label">
        EMERGENCY UNIT
      </div>

      <div className="vehicle-grid">
        {vehicles.map((vehicle) => {
          const Icon = vehicle.icon;

          const isSelected =
            selectedVehicle === vehicle.id;

          return (
            <button
              key={vehicle.id}
              type="button"
              className={`vehicle-card ${
                isSelected ? "selected" : ""
              }`}
              onClick={() =>
                onVehicleChange(vehicle.id)
              }
              aria-pressed={isSelected}
            >
              <Icon className="vehicle-icon" />

              <span className="vehicle-name">
                {vehicle.label}
              </span>

              <span className="vehicle-description">
                {vehicle.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default VehicleSelector;