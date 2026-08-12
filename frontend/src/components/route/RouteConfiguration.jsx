import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaCrosshairs,
  FaSearchLocation,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function RouteConfiguration({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onOriginSelect,
  onDestinationSelect,
  onCurrentLocation,
  onFindRoute,
}) {
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] =
    useState([]);

  const [showOriginSuggestions, setShowOriginSuggestions] =
    useState(false);

  const [
    showDestinationSuggestions,
    setShowDestinationSuggestions,
  ] = useState(false);

  const searchPlaces = async (query, setSuggestions) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/autosuggest?query=${encodeURIComponent(
          trimmedQuery
        )}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSuggestions([]);
        return;
      }

    
      setSuggestions(
        (data.suggestions || [])
          .filter((place) => place.eLoc && place.placeName)
          .slice(0, 5)
      );
    } catch (error) {
      console.error("Autosuggest error:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (origin.trim().length >= 2) {
        searchPlaces(origin, setOriginSuggestions);
      } else {
        setOriginSuggestions([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [origin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (destination.trim().length >= 2) {
        searchPlaces(destination, setDestinationSuggestions);
      } else {
        setDestinationSuggestions([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [destination]);

  const handleOriginSelect = (place) => {
    console.log("Selected origin:", place);

    onOriginChange(place.placeName);

    if (onOriginSelect) {
      onOriginSelect(place);
    }

    setOriginSuggestions([]);
    setShowOriginSuggestions(false);
  };

  const handleDestinationSelect = (place) => {
    console.log("Selected destination:", place);

    onDestinationChange(place.placeName);

    if (onDestinationSelect) {
      onDestinationSelect(place);
    }

    setDestinationSuggestions([]);
    setShowDestinationSuggestions(false);
  };

  const handleFindRoute = () => {
    onFindRoute();
  };

  return (
    <div className="route-configuration">

      <div className="route-fields">

        <div className="route-field">

          <label htmlFor="origin">
            <FaMapMarkerAlt />
            ORIGIN
          </label>

          <div className="input-wrapper">

            <input
              id="origin"
              type="text"
              value={origin}
              onChange={(event) => {
                onOriginChange(event.target.value);

                if (onOriginSelect) {
                  onOriginSelect(null);
                }

                setShowOriginSuggestions(true);
              }}
              onFocus={() => {
                if (originSuggestions.length > 0) {
                  setShowOriginSuggestions(true);
                }
              }}
              placeholder="Enter starting location"
              autoComplete="off"
            />

            <button
              type="button"
              onClick={onCurrentLocation}
              title="Use current location"
              aria-label="Use current location"
            >
              <FaCrosshairs />
            </button>

          </div>

          {showOriginSuggestions &&
            originSuggestions.length > 0 && (
              <div className="suggestions-list">

                {originSuggestions.map((place) => (
                  <button
                    type="button"
                    key={place.eLoc}
                    className="suggestion-item"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleOriginSelect(place);
                    }}
                  >

                    <div className="suggestion-title">
                      <FaMapMarkerAlt />
                      <span>{place.placeName}</span>
                    </div>

                    <div className="suggestion-address">
                      {place.placeAddress || "Location"}
                    </div>

                  </button>
                ))}

              </div>
            )}

        </div>

        <div className="route-field">

          <label htmlFor="destination">
            <FaSearchLocation />
            DESTINATION
          </label>

          <div className="input-wrapper">

            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(event) => {
                onDestinationChange(event.target.value);

                if (onDestinationSelect) {
                  onDestinationSelect(null);
                }

                setShowDestinationSuggestions(true);
              }}
              onFocus={() => {
                if (destinationSuggestions.length > 0) {
                  setShowDestinationSuggestions(true);
                }
              }}
              placeholder="Enter destination"
              autoComplete="off"
            />

          </div>

          {showDestinationSuggestions &&
            destinationSuggestions.length > 0 && (
              <div className="suggestions-list">

                {destinationSuggestions.map((place) => (
                  <button
                    type="button"
                    key={place.eLoc}
                    className="suggestion-item"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleDestinationSelect(place);
                    }}
                  >

                    <div className="suggestion-title">
                      <FaMapMarkerAlt />
                      <span>{place.placeName}</span>
                    </div>

                    <div className="suggestion-address">
                      {place.placeAddress || "Location"}
                    </div>

                  </button>
                ))}

              </div>
            )}

        </div>

      </div>

      <button
        type="button"
        className="find-route-btn"
        onClick={handleFindRoute}
      >
        <FaSearchLocation />

        <span>
          FIND FASTEST ROUTE
        </span>
      </button>

    </div>
  );
}

export default RouteConfiguration;