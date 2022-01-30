import { Box } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const PlayQuiz: NextPage = () => {
    const router = useRouter();
    useEffect(() => {
        const { id } = router.query;
    }, []);
    return <Box></Box>;
};

export default PlayQuiz;
