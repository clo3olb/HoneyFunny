import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { auth } from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
    const [user] = useAuthState(auth);
    const router = useRouter();
    useEffect(() => {
        if (!user) router.push("/login");
        if (router.pathname == "/login") router.back();
    }, [user]);
    return (
        <>
            <AppBar position="static">
                <Container maxWidth="md">
                    <Toolbar>
                        <Link href="/">
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ cursor: "pointer" }}>
                                HoneyFunny
                            </Typography>
                        </Link>
                        <Button onClick={() => auth.signOut()} color="inherit">
                            Logout
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth="md">
                <Component {...pageProps} />
            </Container>
        </>
    );
}

export default MyApp;
