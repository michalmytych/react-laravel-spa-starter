import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthState } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  return (
    <div>
      <h1>Logowanie</h1>
      {status === "loading" && <p>Logowanie...</p>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {user && <p>Już jesteś zalogowany jako {user.email}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <Input
            isRequired
            label="Email"
            type="email"
            value={email}
            onChange={(value) => {
              dispatch(resetAuthState());
              setEmail(value);
            }}
          />
        </div>
        <div>
          <Input
            isRequired
            type="password"
            value={password}
            onChange={(value) => {
              dispatch(resetAuthState());
              setPassword(value);
            }}
          />
        </div>
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
}
