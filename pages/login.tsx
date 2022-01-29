import type { NextPage } from "next";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/clientApp";

const Login: NextPage = () => {
    const handleLogin = () => {
        signInWithPopup(auth, new GoogleAuthProvider());
    };

    return <button onClick={handleLogin}>Sign in with Google</button>;
};

export default Login;
