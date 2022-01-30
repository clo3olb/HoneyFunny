import type { NextPage } from "next";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Box, Button, Container } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login: NextPage = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const handleLogin = () => {
        signInWithPopup(auth, new GoogleAuthProvider());
    };

    useEffect(() => {
        if (user) router.push("/");
    }, []);

    return (
        <Container>
            <Box display="flex" justifyContent="center" marginTop={8}>
                <Button variant="contained" color="success" startIcon={<GoogleIcon />} onClick={handleLogin}>
                    Sign in with Google
                </Button>
            </Box>
        </Container>
    );
};

export default Login;
