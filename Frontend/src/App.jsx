import { BrowserRouter, Routes, Route } from "react-router-dom";
import RestaurantHome from "./pages/restaurant/RestaurantHome";
import Login from "./pages/restaurant/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/restaurant">
          <Route index element={<RestaurantHome />} />
          <Route path='login' element={<Login />} />
          {/* <Route path='register' />
          <Route path='/order/status' />
          <Route path='/order' /> */}
        </Route>
        <Route path="/driver">
        </Route>
        <Route path="/tracking"></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;