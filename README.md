# E-Map

E-map is a powerful tool which helps managing and visualising geospatial data, enabling you to upload, edit, and analyze geographical information with ease.  

![logo-no-background](https://github.com/sanjana-vivek/E-Map/assets/126575036/0fd01959-7063-45d0-b74c-86364fdc1bec)


## Features

<ins>**User Management and Data Upload:**</ins>
Users can sign in using their google account. Once signed in, an upload file button is visible for getting started with the application.
There exists a feauture to upload GeoJSON/KML and TIFF files. 
There is an error on rendering the uploaded file on a map. I'm working on fixing that. 
I have learnt utilised Mapbox GL JS for this project.

<ins>**Distance Measurement:**</ins>
Users can measure distances over the map by providing the coordinates of 2 different locations. 

<ins>**Point Marker Management:**</ins>
Users can add custom markers to their map by providing the coordinates of the location where they wish to add a marker.
Though there is a problem with file rendering over the map, I have tested this feature on a sample map provided by mapbox.

I plan to include hover card information and drawing and editing shapes over the map once I fix my file upload bug.


## Set-up and Run the Project

CLone the repository to your local machine using the following command:

```bash
git clone sanjana-vivek/E-Map
```

Change your working directory to the cloned project directory: 

```bash
cd e-map
```

Install necessary dependencies: 

```bash
npm install npm
```

```bash
npm install mapbox-gl
```

```bash
npm install formidable
```

```bash
npm install @tmcw/togeojson
```

```bash
npm install axios
```


To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 



## Deployed on Vercel

Click on the latest release to view the site under production. 
(Under active development)
