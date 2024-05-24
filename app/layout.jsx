import "@styles/globals.css";

//calling the navbar here and not in home page alone since we want to reuse it across all pages
import Nav from "@components/Nav";
import Provider from "@components/Provider";

export const metadata = {
  title: "E-Map",
  description: "E-Map: Explore, Visualise, Manage Geospatial Data",
};
const Rootlayout = ({ children }) => {
  return (
    <html>
      <body>
        <Provider>
          <div className="main">
            <div className="gradient"></div>
          </div>
          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default Rootlayout;
