import { BrowserRouter as Router, useRoutes } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import routes from "./routes";

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

export default function App() {
  return (
    <Router>
      <div className="App">
        {/* <Header /> */}

        <AppRoutes />

        {/* <Footer /> */}
      </div>
    </Router>
  );
}
