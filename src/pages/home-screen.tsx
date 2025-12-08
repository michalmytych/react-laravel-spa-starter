import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUser, logoutUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";
import { Button } from "@/components/base/buttons/button";

export const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);

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
    <div className="flex h-dvh flex-col">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
        <div className="relative flex size-28 items-center justify-center">
          <UntitledLogoMinimal className="size-10" />
        </div>

        <h1 className="max-w-3xl text-center text-display-sm font-semibold text-primary">
          Untitled UI Vite starter kit
        </h1>

        <div className="mt-6 flex items-center gap-3 text-primary">
          {user ? (
            <div className="text-center">
              <p>
                Zalogowany jako: {user.name} ({user.email})
              </p>
              <Button color="primary-destructive" size="md" onClick={handleLogout}>Wyloguj</Button>
            </div>
          ) : (
            <div className="text-center">
              <p>Nie jesteś zalogowany.</p>
              <p>
                <Link to="/login">Przejdź do logowania</Link> {" | "}
                <Link to="/register">Rejestracja</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
