import type { NextPage } from "next";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Login: NextPage = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const handleLogin = () => {
        signInWithPopup(auth, new GoogleAuthProvider());
    };

    useEffect(() => {
        if (user) router.push("/");
    }, []);

    return <button onClick={handleLogin}>Sign in with Google</button>;
};

export default Login;
