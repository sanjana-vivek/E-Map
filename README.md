# E-Map
E-map is a powerful tool which helps managing and visualising geospatial data, enabling you to upload, edit, and analyze geographical information with ease.  

## Features
<ins>**User Management and Data Upload:**
Users can sign in using their google account. Once signed in, an upload file button is visible for getting started with the application.
There exists a feauture to upload GeoJSON/KML and TIFF files. 
There is an error on rendering the uploaded file on a map. I'm working on fixing that. 
I have learnt utilised Mapbox GL JS for this project.

<ins>**Distance Measurement:**
Users can measure distances over the map by providing the coordinates of 2 different locations. 

<ins>**Point Marker Management:**
Users can add custom markers to their map by providing the coordinates of the location where they wish to add a marker.
Though there is a problem with file rendering over the map, I have tested this feature on a sample map provided by mapbox.

I plan to include hover card information and drawing and editing shapes over the map once I fix my file upload bug.

## Set-up and Running the Project

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
install npm
```

Configure environment variables:

```bash
cp.env.example.env
```

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 

Click on the latest release to view the site under production. 


## Deployed on Vercel

(Under active development)
