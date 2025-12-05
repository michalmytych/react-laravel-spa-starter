import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, logoutUser } from "../store/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  if (status === "loading" && !user) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <>
          <p>
            Zalogowany jako: {user.name} ({user.email})
          </p>
          <button onClick={handleLogout}>Wyloguj</button>
        </>
      ) : (
        <>
          <p>Nie jesteś zalogowany.</p>
          <p>
            <a href="/login">Przejdź do logowania</a> |{" "}
            <a href="/register">Rejestracja</a>
          </p>
        </>
      )}
    </div>
  );
}
