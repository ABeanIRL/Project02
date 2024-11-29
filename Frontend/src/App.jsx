import RestaurantHome from "./pages/restaurant/RestaurantHome";
import Login from "./pages/restaurant/Login";
import TrackingHome from "./pages/tracking/TrackingHome";
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Homepage from './pages/restaurant/Homepage';
import NewOrder from './pages/restaurant/NewOrder';
import MyOrders from './pages/restaurant/MyOrders';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/restaurant">
          <Route index element={<RestaurantHome />} />
          <Route path="login" element={<Login />} />
          {/* <Route path='register' />
          <Route path='/order/status' />
          <Route path='/order' /> */}
        </Route>
        <Route path="/driver"></Route>
        <Route path="/tracking">
          <Route index element={<TrackingHome />} />
        </Route>
        {/* element={<Menu />} is about pages/Menu.jsx */}
        <Route path='/restaurant' element={<Homepage />} />
        <Route path='/restaurant/order' element={<NewOrder />} />
        <Route path='/restaurant/myOrders' element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
