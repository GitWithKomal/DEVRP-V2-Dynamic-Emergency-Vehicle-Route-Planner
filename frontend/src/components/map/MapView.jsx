import { useEffect, useRef, useState } from "react";
import { mappls } from "mappls-web-maps";

const mapplsClassObject = new mappls();

const MAPPLS_TOKEN = import.meta.env.VITE_MAPPLS_TOKEN;
const API_URL = import.meta.env.VITE_API_URL;
function MapView({ routeRequest, onRouteCalculated, facilityRoute }) {
  const mapRef = useRef(null);

  const routeRef = useRef(null);
  const startMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState("");
  const facilityMarkerRef = useRef(null);
  const emergencyVehicleMarkerRef = useRef(null);

  useEffect(() => {
    if (!MAPPLS_TOKEN) {
      setError("Mappls token is missing.");
      return;
    }

    console.log("Mappls token loaded:", MAPPLS_TOKEN.length);

    mapplsClassObject.initialize(
      MAPPLS_TOKEN,
      {
        map: true,
      },
      () => {
        console.log("Mappls SDK initialized");

        if (mapRef.current) {
          return;
        }

        const newMap = mapplsClassObject.Map({
          id: "devrp-map",

          properties: {
            center: [21.1458, 79.0882],
            zoom: 12,
          },
        });

        mapRef.current = newMap;

        newMap.on("load", () => {
          console.log("Mappls map loaded");

          setIsMapLoaded(true);
        });
      },
    );

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();

        mapRef.current = null;
      }
    };
  }, []);

  const calculateRoute = async () => {
    if (!mapRef.current || !isMapLoaded) {
      return;
    }

    if (!routeRequest) {
      console.warn("No route request available.");

      return;
    }

    const origin = routeRequest.origin;
    const destination = routeRequest.destination;

    if (!origin || !destination) {
      setError("Please select both origin and destination.");
      return;
    }

    const start = origin.eLoc || `${origin.longitude},${origin.latitude}`;

    const destinationPoint =
      destination.eLoc || `${destination.longitude},${destination.latitude}`;

    setLoadingRoute(true);
    setError("");

    try {
      console.log("Sending route request:");

      console.log("Origin eLoc:", routeRequest.origin.eLoc);

      console.log("Destination eLoc:", routeRequest.destination.eLoc);

      const response = await fetch(`${API_URL}/api/route`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          start,
          destination: destinationPoint,
        }),
      });

      const data = await response.json();

      console.log("Route API response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to calculate route");
      }

      if (!data.route_coordinates || data.route_coordinates.length === 0) {
        throw new Error("Route coordinates were not returned by backend.");
      }

      setRouteData(data);

      if (onRouteCalculated) {
        onRouteCalculated({
          ...data,
          originName: routeRequest.origin.placeName,
          destinationName: routeRequest.destination.placeName,
        });
      }

      drawRoute(data);
    } catch (error) {
      console.error("Route error:", error);

      setError(error.message);
    } finally {
      setLoadingRoute(false);
    }
  };

  useEffect(() => {
    if (!routeRequest || !isMapLoaded) {
      return;
    }

    calculateRoute();
  }, [routeRequest, isMapLoaded]);

  const drawRoute = (data) => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const coordinates = data.route_coordinates;

    console.log("Drawing route points:", coordinates.length);

    if (routeRef.current) {
      mapplsClassObject.removeLayer({
        map: map,
        layer: routeRef.current,
      });

      routeRef.current = null;
    }

    if (startMarkerRef.current) {
      startMarkerRef.current.remove?.();

      startMarkerRef.current = null;
    }

    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove?.();

      destinationMarkerRef.current = null;
    }

    const path = coordinates.map((point) => ({
      lat: Number(point.lat),
      lng: Number(point.lng),
    }));

    console.log("Route path:", path);

    routeRef.current = mapplsClassObject.Polyline({
      map: map,

      path: path,

      strokeColor: "#2563eb",

      strokeOpacity: 0.9,

      strokeWeight: 6,
    });

    startMarkerRef.current = mapplsClassObject.Marker({
      map: map,

      position: {
        lat: Number(data.start.lat),

        lng: Number(data.start.lng),
      },
    });

    destinationMarkerRef.current = mapplsClassObject.Marker({
      map: map,

      position: {
        lat: Number(data.destination.lat),

        lng: Number(data.destination.lng),
      },
    });

    console.log("Route drawn successfully.");
  };

  useEffect(() => {
    if (
      !facilityRoute ||
      !isMapLoaded ||
      !mapRef.current ||
      !facilityRoute.route_coordinates?.length
    ) {
      return;
    }

    const map = mapRef.current;

    const path = facilityRoute.route_coordinates.map((point) => ({
      lat: Number(point.lat),
      lng: Number(point.lng),
    }));

    console.log("DRAWING EMERGENCY ROUTE:", path.length);

    mapplsClassObject.Polyline({
      map,
      path,
      strokeColor: "#ef4444",
      strokeOpacity: 1,
      strokeWeight: 8,
    });

    emergencyVehicleMarkerRef.current = mapplsClassObject.Marker({
      map,
      position: path[0],
    });

    facilityMarkerRef.current = mapplsClassObject.Marker({
      map,
      position: path[path.length - 1],
    });
  }, [facilityRoute, isMapLoaded]);

  return (
    <div
      id="devrp-map"
      className="relative h-full w-full overflow-hidden rounded-xl"
    >
      {!isMapLoaded && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
          <div className="rounded-lg bg-black/70 px-4 py-2 text-sm text-white">
            Loading Map...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute left-4 top-4 z-20 rounded-lg bg-red-600 px-4 py-3 text-sm text-white shadow-lg">
          {error}
        </div>
      )}
      {routeData && (
        <div className="absolute bottom-4 left-4 z-20 rounded-xl bg-black/80 px-5 py-4 text-white shadow-xl backdrop-blur-md">
          <div className="text-xs uppercase tracking-wider text-gray-400">
            Route Information
          </div>

          <div className="mt-2 flex gap-6">
            <div>
              <div className="text-xl font-bold">
                {routeData.distance_km} km
              </div>

              <div className="text-xs text-gray-400">Distance</div>
            </div>

            <div>
              <div className="text-xl font-bold">
                {routeData.duration_min} min
              </div>

              <div className="text-xs text-gray-400">ETA</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;
