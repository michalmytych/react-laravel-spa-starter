// src/pages/Register.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetAuthState } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(
      registerUser({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
    );
    if (registerUser.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  return (
    <div>
      <h1>Rejestracja</h1>
      {status === "loading" && <p>Rejestracja...</p>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {user && <p>Jesteś zalogowany jako {user.email}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Imię / nazwa: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              dispatch(resetAuthState());
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              dispatch(resetAuthState());
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Hasło: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              dispatch(resetAuthState());
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Powtórz hasło: </label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => {
              dispatch(resetAuthState());
              setPasswordConfirmation(e.target.value);
            }}
          />
        </div>
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
}
