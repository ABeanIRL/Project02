//import RestaurantHome from "./pages/restaurant/RestaurantHome";
import Login from "./pages/restaurant/Login";
import TrackingHome from "./pages/tracking/TrackingHome";
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import RestaurantHome from './pages/restaurant/RestaurantHome';
import NewOrder from './pages/restaurant/NewOrder';
import MyOrders from './pages/restaurant/MyOrders';
import Register from "./pages/restaurant/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/restaurant">
          <Route index element={<RestaurantHome />} />
          <Route path="login" element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='order' element={<NewOrder />} />
          <Route path='myOrders' element={<MyOrders />} />
        </Route>
        <Route path="/driver"></Route>
        <Route path='/tracking' element={<TrackingHome />} />
        </Routes>
    </BrowserRouter>
  );
};

export default App;
