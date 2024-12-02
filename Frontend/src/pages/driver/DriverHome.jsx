import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearDriver } from "../../slice/driverSlice.js";
import MenuAppBar from "../../components/MenuAppBar";
import Container from "@mui/material/Container";

const DriverHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver.value);

  const onLogout = (event) => {
    event.preventDefault();
    dispatch(clearDriver());
  };

  useEffect(() => {
    if (!driver) {
      navigate("/driver/login");
    }
  }, [driver, navigate]);

  return (
    <>
      <MenuAppBar user={driver} onLogout={onLogout} />
      <Container></Container>
    </>
  );
};

export default DriverHome;
