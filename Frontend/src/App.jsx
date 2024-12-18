import { BrowserRouter, Routes, Route } from "react-router-dom";
import RestaurantHome from "./pages/restaurant/RestaurantHome";
import RestaurantLogin from "./pages/restaurant/RestaurantLogin";
import TrackingHome from "./pages/tracking/TrackingHome";
import DriverHome from "./pages/driver/DriverHome";
import DriverRegister from "./pages/driver/DriverRegister";
import DriverLogin from "./pages/driver/DriverLogin";
import RestaurantRegister from "./pages/restaurant/RestaurantRegister";
import OrderMenu from "./pages/restaurant/OrderMenu";
import OrderStatus from "./pages/restaurant/OrderStatus";
import DriverPrivateRoutes from "./routes/DriverPrivateRoutes";
import RestaurantPrivateRoutes from "./routes/RestaurantPrivateRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/restaurant">
          <Route index element={<RestaurantHome />} />
          <Route path="login" element={<RestaurantLogin />} />
          <Route path="register" element={<RestaurantRegister />} />
          <Route
            path="order"
            element={
              <RestaurantPrivateRoutes>
                <OrderMenu />
              </RestaurantPrivateRoutes>
            }
          />
          <Route path="my-order" element={<OrderStatus />} />
        </Route>
        <Route path="/driver">
          <Route
            index
            element={
              <DriverPrivateRoutes userType="driver">
                <DriverHome />
              </DriverPrivateRoutes>
            }
          />
          <Route path="login" element={<DriverLogin />} />
          <Route path="register" element={<DriverRegister />} />
        </Route>
        <Route path="/tracking">
          <Route index element={<TrackingHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
