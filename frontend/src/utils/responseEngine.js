export function generateResponseAnalysis({
  selectedVehicle,
  routeSummary,
  emergencyActive,
  origin,
  destination,
}) {
  const vehicleNames = {
    ambulance: "Ambulance",
    fire: "Fire & Rescue",
    police: "Police",
  };

  const vehicleName =
    vehicleNames[selectedVehicle] || "Emergency Unit";

  if (!routeSummary) {
    return {
      level: "STANDBY",
      title: "Emergency intelligence standby",
      message:
        "Configure a valid origin and destination to begin route analysis.",
      recommendation:
        "Awaiting route calculation.",
      routeStatus: "READY",
    };
  }

  const distance = Number(routeSummary.distance_km || 0);
  const eta = Number(routeSummary.duration_min || 0);

  if (emergencyActive) {
    let priority = "EXTENDED RESPONSE";
    let recommendation =
      `Maintain the calculated fastest route. Estimated arrival is ${eta} minutes over ${distance} km.`;

    if (eta <= 10) {
      priority = "CRITICAL RESPONSE";

      recommendation =
        `Critical response activated. Maintain the fastest calculated route with an estimated arrival of ${eta} minutes.`;
    } else if (eta <= 20) {
      priority = "HIGH PRIORITY";

      recommendation =
        `High-priority response activated. Maintain the calculated fastest route with an estimated arrival of ${eta} minutes.`;
    }

    return {
      level: priority,

      title: `${vehicleName} response activated`,

      message:
        `${vehicleName} has been assigned to the emergency route from ` +
        `${origin || "the selected origin"} to ` +
        `${destination || "the selected destination"}.`,

      recommendation,

      routeStatus: "ACTIVE",

      origin,
      destination,
    };
  }

  let routeMessage =
    `Estimated travel time is ${eta} minutes across ${distance} km.`;

  if (eta <= 10) {
    routeMessage +=
      " The calculated route provides a rapid response option.";
  } else if (eta <= 20) {
    routeMessage +=
      " The route is suitable for priority response.";
  } else {
    routeMessage +=
      " Consider activating SOS when the response unit is ready.";
  }

  return {
    level: "ROUTE READY",

    title: `${vehicleName} route prepared`,

    message:
      "The optimized emergency route has been calculated successfully.",

    recommendation: routeMessage,

    routeStatus: "READY",

    origin,
    destination,
  };
}