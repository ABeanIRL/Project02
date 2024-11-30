//import RestaurantHome from "./pages/restaurant/RestaurantHome";
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
import Register from "./pages/restaurant/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/driver"></Route>
        <Route path='/tracking' element={<TrackingHome />} />
        <Route path='/restaurant' element={<Homepage />} />
        <Route path='/restaurant/login' element={<Login />} />
        <Route path='/restaurant/register' element={<Register />} />
        <Route path='/restaurant/order' element={<NewOrder />} />
        <Route path='/restaurant/myOrders' element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
