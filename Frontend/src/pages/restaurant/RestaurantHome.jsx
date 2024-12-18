import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import RestaurantHeader from "../../components/RestaurantHeader";
import RestaurantFooter from "../../components/RestaurantFooter";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import heroPhoto1 from "../../assets/heroPhoto1.jpg";
import spaghettiPhoto1 from "../../assets/spaghetti.jpg";
import gnocchiPhoto1 from "../../assets/gnocchi.jpg";
import fettucciniPhoto1 from "../../assets/fettuccini.jpg";
import tortelliniPhoto1 from "../../assets/tortellini.jpg";
import chefPhoto1 from "../../assets/chef.jpg";
import { logout, setCredentials } from "../../features/auth/customerSlice";

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const customer = useSelector((state) => state.customer);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerOffset = headerRef.current.offsetTop;
      setIsSticky(scrollY >= headerOffset);
    };

    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateHeaderHeight);

    updateHeaderHeight(); // Update on component mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/restaurant/session",
          {
            credentials: "include",
          }
        );
        const res = await response.json();
        if (res.data) {
          dispatch(setCredentials(res.data));
        } else {
          dispatch(logout());
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        localStorage.removeItem("customerUser");
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/restaurant/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        dispatch(logout());
        navigate("/restaurant");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffe6e6",
      }}
    >
      {/* // beginning of hero page */}
      <Box
        sx={{
          height: "100vh",
          backgroundImage: `url(${heroPhoto1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "white",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(139,0,0,0.5)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: "Courier",
              textAlign: "center",
            }}
          >
            welcome to gustosa
          </Typography>
        </Box>
      </Box>
      {/* //end of hero page */}

      {/* Sticky Header */}
      <Box
        id="header"
        ref={headerRef}
        sx={{
          position: isSticky ? "fixed" : "relative",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 10,
          backgroundColor: "rgba(255, 230, 230, 0.95)",
          transition: "all 0.3s ease",
          boxShadow: isSticky ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        <RestaurantHeader
          user={customer.userInfo}
          handleLogout={handleLogout}
        />
      </Box>

      {isSticky && <Box sx={{ minHeight: `${headerHeight}px` }}></Box>}

      {/*end of sticky header */}

      {/* start of featured item */}
      <Box sx={{ padding: "4rem", backgroundColor: "#ffe6e6" }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontFamily: "Cormorant Garamond, serif",
            marginBottom: "2rem",
          }}
        >
          Featured Dishes
        </Typography>
        <Grid container rowSpacing={4} columnSpacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <img
                src={spaghettiPhoto1}
                alt="Photo of pasta"
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <Typography
                variant="h6"
                sx={{
                  marginTop: "1rem",
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                Pasta Carbonara
              </Typography>
              <Typography variant="body2" sx={{ color: "#555" }}>
                A classic Roman dish with creamy egg sauce, crispy pancetta, and
                a touch of black pepper.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <img
                src={tortelliniPhoto1}
                alt="Photo of Tortellini"
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <Typography
                variant="h6"
                sx={{
                  marginTop: "1rem",
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                Tuscan Baked Tortellini
              </Typography>
              <Typography variant="body2" sx={{ color: "#555" }}>
                Cheese-filled tortellini baked in a rich tomato sauce with a
                golden, cheesy crust.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <img
                src={fettucciniPhoto1}
                alt="Photo of Fettucine Alfredo"
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <Typography
                variant="h6"
                sx={{
                  marginTop: "1rem",
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                Fettucine Alfredo
              </Typography>
              <Typography variant="body2" sx={{ color: "#555" }}>
                Silky smooth Alfredo sauce with butter, cream, and Parmesan over
                tender fettuccine.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <img
                src={gnocchiPhoto1}
                alt="Photo of Gnocchi"
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <Typography
                variant="h6"
                sx={{
                  marginTop: "1rem",
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                Gnocchi in Pomodoro
              </Typography>
              <Typography variant="body2" sx={{ color: "#555" }}>
                Soft potato gnocchi in a fresh tomato and basil sauce, topped
                with grated Parmesan.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* end of featured item */}

      {/* call to action section */}
      <Box
        sx={{
          backgroundColor: "darkred",
          padding: "3rem",
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Ready to Experience Authentic Italian Cuisine?
        </Typography>
        <Button
          component={Link}
          variant="contained"
          sx={{
            marginTop: "1rem",
            backgroundColor: "white",
            color: "darkred",
            "&:hover": { backgroundColor: "#ffe6e6", color: "darkred" },
          }}
          to="/restaurant/order"
        >
          Order Now
        </Button>
      </Box>

      {/* end of call to action */}

      {/* Head chef biography */}
      <Box
        sx={{
          backgroundColor: "#ffe6e6",
          padding: "3rem",
          textAlign: "center",
          color: "black",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          {/* Chef Image */}
          <Grid size={{ xs: 12, md: 4 }}>
            {" "}
            {/* Full width on small screens, 4/12 on medium+ */}
            <img
              src={chefPhoto1}
              alt="Photo of Head Chef"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </Grid>

          {/* Chef Description */}
          <Grid size={{ xs: 12, md: 8 }}>
            {" "}
            {/* Full width on small screens, 8/12 on medium+ */}
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Cormorant Garamond, serif",
                marginBottom: "1rem",
              }}
            >
              Head Chef: Giuseppe Di Stefano
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Cormorant Garamond, serif",
                textAlign: "justify", // Optional for better readability
              }}
            >
              Giuseppe Di Stefano was born in the heart of Rome. He grew up
              surrounded by the sights, sounds, and smells of his family&apos;s
              restaurant, where he learned to cook from his grandmother, Nonna
              Maria. Giuseppe&apos;s passion for food and cooking led him to
              study at the prestigious Culinary Institute of Italy, where he
              honed his skills in the art of pasta-making. After working in some
              of the finest restaurants in Rome, Giuseppe moved to Toronto to
              share his love of Italian cuisine with the world. Today, he is the
              head chef at Gustosa, where he creates delicious dishes that
              transport diners to the streets of Rome with every bite.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      {/* end of head chef bio */}

      {/* <HomepageMenuList menuItems={items} /> */}
      <RestaurantFooter />
    </Box>
  );
};

export default Menu;
