import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, resetAuthState } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error, user } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

      {error && (
        <pre style={{ color: "red" }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

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
