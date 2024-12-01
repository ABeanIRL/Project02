import { BrowserRouter, Routes, Route } from "react-router-dom";
import RestaurantHome from "./pages/restaurant/RestaurantHome";
import Login from "./pages/restaurant/Login";
import TrackingHome from "./pages/tracking/TrackingHome";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/restaurant">
          <Route index element={<RestaurantHome />} />
          <Route path="login" element={<Login />} />
          <Route path='register' />
        </Route>
        <Route path="/driver"></Route>
        <Route path="/tracking">
          <Route index element={<TrackingHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
