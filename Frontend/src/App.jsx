import { BrowserRouter, Routes, Route } from "react-router-dom";
import RestaurantHome from "./pages/restaurant/RestaurantHome";
import RestaurantLogin from "./pages/restaurant/RestaurantLogin";
import TrackingHome from "./pages/tracking/TrackingHome";
import DriverHome from "./pages/driver/DriverHome";
import DriverRegister from "./pages/driver/DriverRegister";
import DriverLogin from "./pages/driver/DriverLogin";
import RestaurantRegister from "./pages/restaurant/RestaurantRegister";
import NewOrder from "./pages/restaurant/newOrder";
import MyOrders from "./pages/restaurant/MyOrders";
import OrderUpdatePage from "./pages/tracking/OrderUpdatePage";
import MyOrdersPage from "./pages/driver/MyOrdersPage";
import FulfillmentPage from "./pages/driver/FulfillmentPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/restaurant">
          <Route index element={<RestaurantHome />} />
          <Route path="login" element={<RestaurantLogin />} />
          <Route path="register" element={<RestaurantRegister />} />
          <Route path="order" element={<NewOrder />} />
          <Route path="myOrders" element={<MyOrders />} />
        </Route>
        <Route path="/driver">
          <Route index element={<DriverHome />} />
          <Route path="login" element={<DriverLogin />} />
          <Route path="register" element={<DriverRegister />} />
          <Route path="orders" element={<MyOrdersPage />} />
          <Route path="fulfill-order/:orderId" element={<FulfillmentPage />} />
        </Route>
        <Route path="/tracking">
          <Route index element={<TrackingHome />} />
          <Route path="update-order/:orderId" element={<OrderUpdatePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
