import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, resetAuthState } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(true);
    const [password, setPassword] = useState<string>("");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { status, error, user } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const resultAction = await dispatch(loginUser({ email, password }));

        if (loginUser.fulfilled.match(resultAction)) {
            navigate("/");
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center">
                <form onSubmit={handleSubmit} className="space-y-4 w-full sm:w-5/6 md:w-1/2 lg:w-1/3 xl:w-1/4 px-4">
                    <h1 className="text-primary font-semibold text-2xl mb-4 text-center mt-9">Zaloguj się</h1>

                    {status === "loading" && <p>Logowanie...</p>}

                    {
                        error?.message ?
                        <div className="bg-red-950 text-red-500 border border-red-500 rounded-lg px-6 py-2">
                            {error?.message}
                        </div> : null
                    }                

                    {user && <p>Jesteś już zalogowany jako {user.email}</p>}

                    <div>
                        <Input
                            isRequired
                            label="E-mail"
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
                            label="Hasło"
                            type="password"
                            value={password}
                            onChange={(value) => {
                                dispatch(resetAuthState());
                                setPassword(value);
                            }}
                        />
                    </div>

                    <div>
                        <Checkbox
                            isSelected={rememberMe}
                            label="Zapamiętaj mnie"
                            onChange={(value) => {
                                setRememberMe(value);
                            }}
                        />
                    </div>

                    <Button color="primary" className="w-full" type="submit">Zaloguj</Button>
                </form>
            </div>
        </div>
    );
}
