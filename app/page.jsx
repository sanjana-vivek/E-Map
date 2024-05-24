import Link from "next/link";

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <br className="max-md:hidden" />
      <br className="max-md:hidden" />
      <h1 className="head_text text-center text-4xl sm:text-5xl">
        Explore, Visualize, Manage
        <br className="max-md:hidden" />
        <span className="green_gradient text-center">Geospatial Data</span>
      </h1>
      <br className="max-md:hidden" />
      <p className="dec text-center">
        E-Map is a powerful tool for managing and visualizing geospatial data,
        enabling you to upload, edit, and analyze geographical information with
        ease.
      </p>
      <br className="max-md:hidden" />
      <br className="max-md:hidden" />
      <br className="max-md:hidden" />
      <br className="max-md:hidden" />
      <img
        src="./assets/images/logo-no-background.png"
        alt="e-map main logo"
        width={350}
        height={200}
      ></img>
      <br className="max-md:hidden" />
      <br className="max-md:hidden" />
      <br className="max-md:hidden" />
      <br className="max-md:hidden" />
      <br className="max-md:hidden" />
      <br className="max-md:hidden" />
      <div className="w-full felx-center flex-col px-4">
        <h1 className="head_text text-left text-4xl sm:text-3xl">
          Interactive map Integration
          <br className="max-md:hidden" />
          <span className="blue_gradient text-center">
            Upload GeoJSON/KML and TIFF files
          </span>
        </h1>
        <p className="dec text-left mb-8">See them rendered on a map</p>
      </div>
      <br className="max-md:hidden" />
      <div className="w-full felx-center flex-col px-4">
        <h1 className="head_text text-right text-4xl sm:text-3xl">
          Custom shape drawing <br className="max-md:hidden" />
          <span className="orange_gradient text-center">
            Draw custom shapes on the map
          </span>
        </h1>
        <p className="dec text-right mb-8">Edit and save your shapes</p>
      </div>
      <br className="max-md:hidden" />
      <div className="w-full felx-center flex-col px-4">
        <h1 className="head_text text-left text-4xl sm:text-3xl">
          Distance Measurement
          <br className="max-md:hidden" />
          <span className="blue_gradient text-center">
            Measure distances on the map
          </span>
        </h1>
        <p className="dec text-left mb-8">In both kilometers and miles</p>
        <br className="max-md:hidden" />
      </div>
      <br className="max-md:hidden" />
      <div className="w-full felx-center flex-col px-4">
        <h1 className="head_text text-right text-4xl sm:text-3xl">
          Point marker management <br className="max-md:hidden" />
          <span className="orange_gradient text-center">
            Add point markers to your map
          </span>
        </h1>
        <p className="dec text-right mb-8">
          Add, move and delete point markers
        </p>
      </div>
      <br className="max-md:hidden" />
      <div className="w-full felx-center flex-col px-4">
        <h1 className="head_text text-left text-4xl sm:text-3xl">
          Hover information cards
          <br className="max-md:hidden" />
          <span className="blue_gradient text-center">Mini card display</span>
        </h1>
        <p className="dec text-left mb-8">On hovering over rendered files or shapes</p>
        <br className="max-md:hidden" />
      </div>
    </section>
  );
};

export default Home;
