import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/restaurant/register",
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ email, password, confirmPassword, username, firstname, lastname, address }),
        }
      );

      if (response.ok) {
        navigate("/restaurant");
      }
    } catch (error) {
      console.error("Request failed:", error.message);
    }
  };

  // STILL WORK TO DO ON THIS
  const validateInputs = () => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!username || password == username) {
      setUsernameError(true);
      setUsernameErrorMessage("Username and password must be different.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
    return isValid;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* if username is not unique */}
        {usernameError && <p style={{ color: "red" }}>{usernameErrorMessage}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && (
          <p style={{ color: "red" }}>{passwordErrorMessage}</p>
        )}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {confirmPasswordError && (
          <p style={{ color: "red" }}>{confirmPasswordErrorMessage}</p>
        )}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p style={{ color: "red" }}>{emailErrorMessage}</p>}
      </div>
      <div>
        <label htmlFor="firstname">First Name</label>
        <input
          id="firstname"
          name="firstname"
          type="text"
          required
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lastname">Last Name</label>
        <input
          id="lastname"
          name="lastname"
          type="text"
          required
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
    //JACOB YOUR JOB IS TO COPY AND PASTE THE FIELDS BELOW SO THAT THE REGISTER PAGE HAS 
// EMAIL
// USERNAME
// PASSWORD
// FIRSTNAME
// LASTNAME
// ADDRESS
  );
};

export default Register;
