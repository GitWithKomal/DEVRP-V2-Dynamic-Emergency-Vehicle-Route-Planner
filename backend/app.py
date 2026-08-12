from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

load_dotenv()

MAPPLS_STATIC_KEY = os.getenv("MAPPLS_STATIC_KEY")

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "DEVRP backend running",
        "map_provider": "Mappls"
    })

def decode_mappls_polyline(encoded):
    """
    Decode Mappls encoded polyline into:
    [
        {"lat": ..., "lng": ...},
        ...
    ]
    """

    points = []

    index = 0
    lat = 0
    lng = 0

    while index < len(encoded):

        shift = 0
        result = 0

        while True:
            byte = ord(encoded[index]) - 63
            index += 1

            result |= (byte & 0x1F) << shift
            shift += 5

            if byte < 0x20:
                break

        delta_lat = (
            ~(result >> 1)
            if result & 1
            else result >> 1
        )

        lat += delta_lat

        shift = 0
        result = 0

        while True:
            byte = ord(encoded[index]) - 63
            index += 1

            result |= (byte & 0x1F) << shift
            shift += 5

            if byte < 0x20:
                break

        delta_lng = (
            ~(result >> 1)
            if result & 1
            else result >> 1
        )

        lng += delta_lng

        points.append({
            "lat": lat / 100000,
            "lng": lng / 100000
        })

    return points

def get_mappls_route(start, destination):

    if not MAPPLS_STATIC_KEY:
        raise RuntimeError(
            "MAPPLS_STATIC_KEY is missing from .env"
        )

    coordinates = f"{start};{destination}"

    url = (
        "https://route.mappls.com/route/direction/"
        f"route_eta/driving/{coordinates}"
    )

    params = {
        "steps": "true",
        "rtype": "0",
        "region": "ind",
        "access_token": MAPPLS_STATIC_KEY
    }

    response = requests.get(
        url,
        params=params,
        timeout=15
    )

    print("Mappls status:", response.status_code)

    if response.status_code != 200:
        raise RuntimeError(
            f"Mappls API returned {response.status_code}"
        )

    data = response.json()

    if data.get("code") != "Ok":
        raise RuntimeError(
            f"Mappls routing failed: {data}"
        )

    routes = data.get("routes", [])

    if not routes:
        raise RuntimeError(
            "No route returned by Mappls"
        )

    route = routes[0]

    encoded_geometry = route.get("geometry")

    route_coordinates = []

    if encoded_geometry:
        route_coordinates = decode_mappls_polyline(
            encoded_geometry
        )

    return {
        "distance_km": round(
            route.get("distance", 0) / 1000,
            2
        ),

        "duration_min": round(
            route.get("duration", 0) / 60,
            1
        ),

        "geometry": encoded_geometry,

        "route_coordinates": route_coordinates,

        "legs": route.get("legs", [])
    }

@app.route("/api/autosuggest", methods=["GET"])
def autosuggest_api():
    try:
        query = request.args.get("query", "").strip()

        if len(query) < 2:
            return jsonify({
                "success": True,
                "suggestions": []
            })

        url = (
            "https://search.mappls.com/"
            "search/places/autosuggest/json"
        )

        params = {
            "query": query,
            "location": "21.1458,79.0882",
            "region": "IND",
            "access_token": MAPPLS_STATIC_KEY
        }

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        print(
            "Mappls Autosuggest status:",
            response.status_code
        )

        if response.status_code == 204:
            print(
                f"No Mappls suggestions for query: {query}"
            )

            return jsonify({
                "success": True,
                "suggestions": []
            })
        
        if response.status_code != 200:
            print(
                "Mappls Autosuggest response:",
                response.text
            )

            return jsonify({
                "success": True,
                "suggestions": []
            })

        if not response.text.strip():
            return jsonify({
                "success": True,
                "suggestions": []
            })

        data = response.json()

        suggestions = data.get(
            "suggestedLocations",
            []
        )

        return jsonify({
            "success": True,
            "suggestions": suggestions
        })

    except requests.RequestException as error:
        print(
            "MAPPLS AUTOSUGGEST REQUEST ERROR:",
            error
        )

        return jsonify({
            "success": True,
            "suggestions": []
        })

    except Exception as error:
        print(
            "AUTOSUGGEST ERROR:",
            error
        )

        return jsonify({
            "success": True,
            "suggestions": []
        })


@app.route("/api/geocode", methods=["GET"])
def geocode_api():

    address = request.args.get("address", "").strip()

    if not address:
        return jsonify({
            "success": False,
            "error": "Address is required"
        }), 400

    try:
        url = (
            "https://search.mappls.com/"
            "search/address/geocode"
        )

        params = {
            "address": address,
            "region": "IND",
            "access_token": MAPPLS_STATIC_KEY
        }

        response = requests.get(
            url,
            params=params,
            timeout=15
        )

        print(
            "Mappls Geocode status:",
            response.status_code
        )

        if response.status_code != 200:
            return jsonify({
                "success": False,
                "error": (
                    "Mappls Geocode API returned "
                    f"{response.status_code}"
                )
            }), response.status_code

        data = response.json()

        cop = data.get("copResults", {})

        return jsonify({
            "success": True,
            "data": cop
        })

    except Exception as error:

        print("GEOCODE ERROR:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500

@app.route("/api/place-details", methods=["GET"])
def place_details_api():
    eloc = request.args.get("eloc", "").strip()

    if not eloc:
        return jsonify({
            "success": False,
            "error": "eLoc is required"
        }), 400

    try:
        url = f"https://explore.mappls.com/apis/O2O/entity/{eloc}"

        params = {
            "access_token": MAPPLS_STATIC_KEY
        }

        response = requests.get(
            url,
            params=params,
            timeout=15
        )

        print(
            "Mappls Place Details status:",
            response.status_code
        )

        if response.status_code != 200:
            return jsonify({
                "success": False,
                "error": (
                    f"Mappls Place Details API "
                    f"returned {response.status_code}"
                )
            }), response.status_code

        data = response.json()

        return jsonify({
            "success": True,
            "data": data
        })

    except Exception as error:
        print(
            "PLACE DETAILS ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500
    
@app.route("/api/route", methods=["POST"])
def route_api():

    try:
        data = request.get_json() or {}

        start = data.get("start")
        destination = data.get("destination")

        if not start or not destination:
            return jsonify({
                "success": False,
                "error": "Start and destination are required"
            }), 400

        print("\n================================")
        print("DEVRP ROUTE REQUEST")
        print("Start:", start)
        print("Destination:", destination)
        print("================================")

        route = get_mappls_route(
            start,
            destination
        )

        route_coordinates = route["route_coordinates"]

        start_coordinates = (
            route_coordinates[0]
            if route_coordinates
            else None
        )

        destination_coordinates = (
            route_coordinates[-1]
            if route_coordinates
            else None
        )

        return jsonify({

            "success": True,

            "start": start_coordinates,

            "destination": destination_coordinates,

            "start_eloc": start,

            "destination_eloc": destination,

            "distance_km": route["distance_km"],

            "duration_min": route["duration_min"],

            "polyline": route["geometry"],

            "route_coordinates": route_coordinates,

            "legs": route["legs"]
        })

    except Exception as error:

        print("BACKEND ERROR:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500

@app.route(
    "/api/sos",
    methods=["POST"]
)
def sos_api():

    data = request.get_json() or {}

    location = data.get(
        "location"
    )

    if not location:

        return jsonify({

            "success": False,

            "error":
                "Location missing"

        }), 400

    print("\n🚨 SOS RECEIVED 🚨")
    print(
        "Location:",
        location
    )

    return jsonify({

        "success": True,

        "message":
            "SOS sent!"

    })

@app.route("/api/location/reverse", methods=["POST"])
def reverse_location():
    try:
        data = request.get_json() or {}

        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if latitude is None or longitude is None:
            return jsonify({
                "success": False,
                "error": "Latitude and longitude are required."
            }), 400

        if not MAPPLS_STATIC_KEY:
            return jsonify({
                "success": False,
                "error": "Mappls static key is not configured."
            }), 500

        url = "https://search.mappls.com/search/address/rev-geocode"

        params = {
            "lat": latitude,
            "lng": longitude,
            "access_token": MAPPLS_STATIC_KEY
        }

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        print("Mappls Reverse Geocode status:", response.status_code)
        print("Mappls Reverse Geocode response:", response.text)

        if response.status_code != 200:
            return jsonify({
                "success": False,
                "error": (
                    f"Mappls reverse geocoding returned "
                    f"{response.status_code}"
                )
            }), response.status_code

        result = response.json()

        results = result.get("results", [])

        if not results:
            return jsonify({
                "success": False,
                "error": "No location information found."
            }), 404

        location = results[0]

        place_name = (
            location.get("formatted_address")
            or location.get("locality")
            or location.get("city")
            or "Current Location"
        )

        return jsonify({
            "success": True,
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "eLoc": location.get("eLoc"),
                "placeName": place_name
            }
        })

    except requests.RequestException as error:
        print("Mappls reverse geocoding error:", error)

        return jsonify({
            "success": False,
            "error": "Unable to contact Mappls."
        }), 502

    except Exception as error:
        print("Reverse location error:", error)

        return jsonify({
            "success": False,
            "error": "Unable to resolve current location."
        }), 500

    except requests.RequestException as error:
        print("Mappls reverse geocoding error:", error)

        return jsonify({
            "success": False,
            "error": "Unable to contact Mappls."
        }), 502

    except Exception as error:
        print("Reverse location error:", error)

        return jsonify({
            "success": False,
            "error": "Unable to resolve current location."
        }), 500

@app.route("/api/nearby-services", methods=["POST"])
def nearby_services():
    try:
        data = request.get_json() or {}

        latitude = data.get("latitude")
        longitude = data.get("longitude")
        service_type = data.get("serviceType", "ambulance")

        if latitude is None or longitude is None:
            return jsonify({
                "success": False,
                "error": "Latitude and longitude are required."
            }), 400

        service_keywords = {
            "ambulance": "hospital",
            "fire": "fire station",
            "police": "police station"
        }

        keyword = service_keywords.get(service_type)

        if not keyword:
            return jsonify({
                "success": False,
                "error": "Invalid emergency service type."
            }), 400

        if not MAPPLS_STATIC_KEY:
            return jsonify({
                "success": False,
                "error": "Mappls static key is not configured."
            }), 500

        url = (
            "https://search.mappls.com/"
            "search/places/nearby/json"
        )

        params = {
            "keywords": keyword,
            "refLocation": f"{latitude},{longitude}",
            "radius": 5000,
            "sortBy": "dist:asc",
            "searchBy": "dist",
            "region": "IND",
            "page": 1,
            "access_token": MAPPLS_STATIC_KEY
        }

        response = requests.get(
            url,
            params=params,
            timeout=15
        )

        print("\n================================")
        print("DEVRP NEARBY SERVICE REQUEST")
        print("Service:", service_type)
        print("Keyword:", keyword)
        print("Location:", latitude, longitude)
        print("Mappls status:", response.status_code)
        print("================================")

        if response.status_code != 200:
            print("Mappls Nearby response:", response.text)

            return jsonify({
                "success": False,
                "error": (
                    f"Mappls Nearby API returned "
                    f"{response.status_code}"
                )
            }), response.status_code

        result = response.json()

        places = result.get("suggestedLocations", [])

        services = []

        for place in places[:5]:
            distance_m = place.get("distance")

            services.append({
                "name": place.get(
                    "placeName",
                    "Emergency Facility"
                ),
                "address": place.get(
                    "placeAddress",
                    ""
                ),
                "eLoc": place.get("eLoc"),
                "distance_km": (
                    round(float(distance_m) / 1000, 2)
                    if distance_m is not None
                    else None
                ),
                "phone": (
                    place.get("mobileNo")
                    or place.get("landlineNo")
                ),
                "type": place.get("type")
            })

        return jsonify({
            "success": True,
            "serviceType": service_type,
            "location": {
                "latitude": latitude,
                "longitude": longitude
            },
            "services": services
        })

    except requests.RequestException as error:
        print("Mappls Nearby request error:", error)

        return jsonify({
            "success": False,
            "error": "Unable to contact Mappls Nearby API."
        }), 502

    except Exception as error:
        print("Nearby services error:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )