import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DriverHome = () => {
  const navigate = useNavigate();
  const driver = useSelector((state) => state.driver.value);
  console.log(driver);

  useEffect(() => {
    if (!driver) {
      navigate("/driver/login");
    }
  }, [driver, navigate]);
};

export default DriverHome;
