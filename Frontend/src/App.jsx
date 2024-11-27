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
        {/* element={<Menu />} is about pages/Menu.jsx */}
        <Route path='/restaurant' element={<Homepage />} />
        <Route path='/restaurant/order' element={<NewOrder />} />
        <Route path='/restaurant/myOrders' element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
