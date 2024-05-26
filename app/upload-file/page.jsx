"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox CSS
import Link from 'next/link';

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

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      setUploadedFiles(result.files);
      console.log('Files uploaded successfully:', result.files);
    } else {
      console.log('File upload failed');
    }
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [12.5683, 55.6761], // starting position [lng, lat] for Copenhagen
      zoom: 9, // starting zoom
    });
  }, []);

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
                <Link href={file} target="_blank">
                  {file}
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
