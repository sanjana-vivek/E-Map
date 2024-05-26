"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS
import Link from "next/link";
import axios from "axios";
import { kml } from "@tmcw/togeojson"; // Import togeojson for KML conversion

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Function to convert kilometers to miles
function kilometersToMiles(kilometers) {
  return kilometers * 0.621371;
}

const UploadFilePage = () => {
  const { data: session } = useSession();
  const [files, setFiles] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [latMarker, setLatMarker] = useState(""); 
  const [lngMarker, setLngMarker] = useState("");
  const [markers, setMarkers] = useState([]);
  const [lat1, setLat1] = useState("");
  const [lng1, setLng1] = useState("");
  const [lat2, setLat2] = useState("");
  const [lng2, setLng2] = useState("");
  const [distanceKilometers, setDistanceKilometers] = useState(null);
  const [distanceMiles, setDistanceMiles] = useState(null);

  const calculateDistanceHandler = () => {
    const distance = calculateDistance(lat1, lng1, lat2, lng2);
    const miles = kilometersToMiles(distance);
    setDistanceKilometers(distance);
    setDistanceMiles(miles);
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await axios.post("/api/upload", formData);
      if (response.status === 200) {
        setUploadedFiles(response.data.files);
        console.log("Files uploaded successfully:", response.data.files);
        renderFilesOnMap(response.data.files);
      } else {
        console.log("File upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const renderFilesOnMap = (files) => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        zoom: 9, // default zoom level
      });
    }

    files.forEach((file) => {
      const filePath = `${file.path}`;
      const fileType = file.type;

      if (fileType === ".geojson") {
        map.current.addSource(`source-${filePath}`, {
          type: "geojson",
          data: filePath,
        });

        map.current.addLayer({
          id: `layer-${filePath}`,
          type: "line",
          source: `source-${filePath}`,
          layout: {},
          paint: {
            "line-color": "#888",
            "line-width": 8,
          },
        });
      } else if (fileType === ".kml") {
        fetch(filePath)
          .then((response) => response.text())
          .then((kmlText) => {
            const parser = new DOMParser();
            const kml = parser.parseFromString(kmlText, "application/xml");
            const geojson = toGeoJSON.kml(kml);
            map.current.addSource(`source-${filePath}`, {
              type: "geojson",
              data: geojson,
            });

            map.current.addLayer({
              id: `layer-${filePath}`,
              type: "line",
              source: `source-${filePath}`,
              layout: {},
              paint: {
                "line-color": "#888",
                "line-width": 8,
              },
            });
          });
      } else if (fileType === ".tiff") {
        map.current.addSource(`source-${filePath}`, {
          type: "raster",
          url: filePath,
          tileSize: 256,
        });

        map.current.addLayer({
          id: `layer-${filePath}`,
          type: "raster",
          source: `source-${filePath}`,
          paint: {},
        });
      }
    });
  };

  const addMarker = () => {
    if (!map.current) return;
    const el = document.createElement("div");
    el.className = "marker";
    new mapboxgl.Marker(el)
      .setLngLat([parseFloat(lngMarker), parseFloat(latMarker)])
      .addTo(map.current);
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      { lat: parseFloat(lat), lng: parseFloat(lng) },
    ]);
    setLatMarker("");
    setLngMarker("");
    alert(
      `You have added your marker at latitude ${latMarker} and longitude ${lngMarker}.`
    );
  };

  return (
    <section className="w-full flex-center flex-col">
      <br className="max-md:hidden" />
      <br className="max-md:hidden" />
      <h1 className="head_text text-center text-4xl sm:text-5xl">
        Upload Your File
      </h1>
      <br className="max-md:hidden" />
      <p className="dec text-center">
        Upload your GeoJSON, KML, and TIFF files to visualize them on the map.
      </p>
      <br className="max-md:hidden" />
      <input type="file" multiple onChange={handleFileChange} />
      <br className="max-md:hidden" />
      <button onClick={handleUpload} className="black_btn">
        Render on Map
      </button>
      {uploadedFiles.length > 0 && (
        <div>
          <h2>Uploaded Files:</h2>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                <Link href={file.path} target="_blank">
                  {file.path}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <section className="w-full flex-center flex-col">
        <br className="max-md:hidden" />
        <br className="max-md:hidden" />
        <h1 className="head_text text-center text-4xl sm:text-5xl green_gradient">
          Map display leveraging Mapbox API
        </h1>
        <br className="max-md:hidden" />
        <p className="dec text-center">
          View the uploaded file visualized on the map.
        </p>
        <br className="max-md:hidden" />
        <div
          ref={mapContainer}
          className="relative w-full h-[500px] mt-8"
        ></div>
      </section>
      <section className="w-full flex-center flex-col">
        <br className="max-md:hidden" />
        <br className="max-md:hidden" />
        <br className="max-md:hidden" />
        <h1 className="head_text text-center text-4xl sm:text-5xl blue_gradient">
          Add custom markers to your map
        </h1>
        <br className="max-md:hidden" />
        <p className="dec text-center">
          Enter the latitude and longitude of your marker.
        </p>
        <br className="max-md:hidden" />
        <br className="max-md:hidden" />
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={latMarker}
            onChange={(e) => setLatMarker(e.target.value)}
            placeholder="Latitude"
            className="p-2 border rounded"
            step="0.000001"
          />
          <input
            type="number"
            value={lngMarker}
            onChange={(e) => setLngMarker(e.target.value)}
            placeholder="Longitude"
            className="p-2 border rounded"
            step="0.000001"
          />
          <button onClick={addMarker} className="black_btn">
            Add Marker
          </button>
        </div>
      </section>
      <style jsx>{`
        .marker {
          background-color: red;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
      <section className="w-full flex-center flex-col">
        <br className="max-md:hidden" />
        <br className="max-md:hidden" />
        <br className="max-md:hidden" />
        <h1 className="head_text text-center text-4xl sm:text-5xl green_gradient">
          Calculate distance between 2 locations
        </h1>
        <br className="max-md:hidden" />
        <p className="dec text-center">
          Enter the latitude and longitude of each location.
        </p>
        <br className="max-md:hidden" />
        <br className="max-md:hidden" />
        <div className="flex gap-2 mb-4">
          <p className="dec text-center">Location 1: </p>
          <input
            type="number"
            value={lat1}
            onChange={(e) => setLat1(parseFloat(e.target.value))}
            placeholder="Latitude 1"
            className="p-2 border rounded"
            step="0.000001"
          />
          <input
            type="number"
            value={lng1}
            onChange={(e) => setLng1(parseFloat(e.target.value))}
            placeholder="Longitude 1"
            className="p-2 border rounded"
            step="0.000001"
          />
        </div>
        <br className="max-md:hidden" />
        <div className="flex gap-2 mb-4">
          <p className="dec text-center">Location 2: </p>
          <input
            type="number"
            value={lat2}
            onChange={(e) => setLat2(parseFloat(e.target.value))}
            placeholder="Latitude 2"
            className="p-2 border rounded"
            step="0.000001"
          />
          <input
            type="number"
            value={lng2}
            onChange={(e) => setLng2(parseFloat(e.target.value))}
            placeholder="Longitude 2"
            className="p-2 border rounded"
            step="0.000001"
          />
        </div>
        <br className="max-md:hidden" />
        <div className="text-center">
          <button onClick={calculateDistanceHandler} className="black_btn">
            Calculate distance
          </button>
        </div>
        <br className="max-md:hidden" />
        {distanceKilometers !== null && distanceMiles !== null && (
          <p className="dec text-center font-weight: 700;">
            The distance between entered coordinates is{" "}
            {distanceKilometers.toFixed(2)} kilometers and{" "}
            {distanceMiles.toFixed(2)} miles.
          </p>
        )}
        <br className="max-md:hidden" />
        <br className="max-md:hidden" />
      </section>
    </section>
  );
};

export default UploadFilePage;
