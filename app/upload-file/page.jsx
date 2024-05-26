"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS
import Link from 'next/link';
import axios from 'axios';
import {kml} from '@tmcw/togeojson'; // Import togeojson for KML conversion

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const UploadFilePage = () => {
  const { data: session } = useSession();
  const [files, setFiles] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [markers, setMarkers] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await axios.post('/api/upload', formData);
      if (response.status === 200) {
        setUploadedFiles(response.data.files);
        console.log('Files uploaded successfully:', response.data.files);
        renderFilesOnMap(response.data.files);
      } else {
        console.log('File upload failed');
      }
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const renderFilesOnMap = (files) => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 9, // default zoom level
      });
    }

    files.forEach((file) => {
      const filePath = `${file.path}`;
      const fileType = file.type;

      if (fileType === '.geojson') {
        map.current.addSource(`source-${filePath}`, {
          type: 'geojson',
          data: filePath,
        });

        map.current.addLayer({
          id: `layer-${filePath}`,
          type: 'line',
          source: `source-${filePath}`,
          layout: {},
          paint: {
            'line-color': '#888',
            'line-width': 8,
          },
        });
      } else if (fileType === '.kml') {
        fetch(filePath)
          .then(response => response.text())
          .then(kmlText => {
            const parser = new DOMParser();
            const kml = parser.parseFromString(kmlText, 'application/xml');
            const geojson = toGeoJSON.kml(kml);
            map.current.addSource(`source-${filePath}`, {
              type: 'geojson',
              data: geojson,
            });

            map.current.addLayer({
              id: `layer-${filePath}`,
              type: 'line',
              source: `source-${filePath}`,
              layout: {},
              paint: {
                'line-color': '#888',
                'line-width': 8,
              },
            });
          });
      } else if (fileType === '.tiff') {
        map.current.addSource(`source-${filePath}`, {
          type: 'raster',
          url: filePath,
          tileSize: 256,
        });

        map.current.addLayer({
          id: `layer-${filePath}`,
          type: 'raster',
          source: `source-${filePath}`,
          paint: {},
        });
      }
    });
  };

  const addMarker = () => {
    if (!map.current) return;
    const el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker(el).setLngLat([parseFloat(lng), parseFloat(lat)]).addTo(map.current);
    setMarkers((prevMarkers) => [...prevMarkers, { lat: parseFloat(lat), lng: parseFloat(lng) }]);
    setLat('');
    setLng('');
    alert(`You have added your marker at latitude ${lat} and longitude ${lng}.`);
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
        <div ref={mapContainer} className="relative w-full h-[500px] mt-8"></div>
      </section>
      <section className="w-full flex-center flex-col">
        <br className="max-md:hidden" />
        <br className="max-md:hidden" />
        <br className="max-md:hidden" />
        <h1 className="head_text text-center text-4xl sm:text-5xl green_gradient">
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
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
            className="p-2 border rounded"
            step="0.000001"
          />
          <input
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
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
    </section>
  );
};

export default UploadFilePage;
