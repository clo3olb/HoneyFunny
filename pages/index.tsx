import { Box, Button, Card, CardHeader, IconButton, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import EditIcon from "@mui/icons-material/Edit";
import PlayIcon from "@mui/icons-material/PlayCircleFilled";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import NewCurriculumDialog from "../components/NewCurriculumDialog";
import { COLLECTION_NAMES, getBaseCurriculum, getBaseQuiz } from "../types";
import { addDoc, collection } from "firebase/firestore";
import { useCurriculum, useMyCurriculums } from "../hooks/useCurriculums";
import { useRouter } from "next/router";
import { useMyQuizzes, useQuiz } from "../hooks/useQuiz";
import EditQuizDialog from "../components/EditQuizDialog";

type CurriculumCardProps = {
    curriculumId: string;
};

const CurriculumCard: NextPage<CurriculumCardProps> = ({ curriculumId }) => {
    const [curriculum] = useCurriculum(curriculumId);
    const [open, setOpen] = useState(false);
    if (!curriculum) return <>Loading Curriculum...</>;
    return (
        <Card>
            <CardHeader
                title={curriculum.title}
                action={
                    <>
                        <IconButton onClick={() => setOpen(true)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="play">
                            <PlayIcon />
                        </IconButton>
                    </>
                }
                subheader={`${curriculum.problemIds.length} questions`}
            />
            <NewCurriculumDialog open={open} handleClose={() => setOpen(false)} curriculumId={curriculumId} />
        </Card>
    );
};

type QuizCardProps = {
    quizId: string;
};

const QuizCard: NextPage<QuizCardProps> = ({ quizId }) => {
    const [quiz, update] = useQuiz(quizId);
    const [open, setOpen] = useState(false);
    if (!quiz) return <>Loading Quiz...</>;
    return (
        <Card>
            <EditQuizDialog open={open} handleClose={() => setOpen(false)} quizId={quizId} />
            <CardHeader
                title={quiz.title}
                action={
                    <>
                        <IconButton onClick={() => setOpen(true)} aria-label="edit">
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="play">
                            <PlayIcon />
                        </IconButton>
                    </>
                }
                subheader="10 Minutes"
            />
        </Card>
    );
};

const Home: NextPage = () => {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();
    const [curriculumIds, updateCurriculumIds] = useMyCurriculums(user);
    const [quizIds, updateQuizIds] = useMyQuizzes(user);

    if (loading) return <>Loading...</>;

    const createNewCurriculum = () => {
        if (!user) return;
        const newCurriculum = getBaseCurriculum(user);
        addDoc(collection(firestore, COLLECTION_NAMES.CURRICULUMS), newCurriculum).then((doc) =>
            updateCurriculumIds([...curriculumIds, doc.id])
        );
    };
    const createNewQuiz = () => {
        if (!user) return;
        const newQuiz = getBaseQuiz(user);
        addDoc(collection(firestore, COLLECTION_NAMES.QUIZZES), newQuiz).then((doc) =>
            updateQuizIds([...quizIds, doc.id])
        );
    };

    return (
        <Box>
            <Typography variant="h3" gutterBottom marginTop={3}>
                My Quizzes
            </Typography>
            <Stack spacing={2} marginBottom={8}>
                {quizIds.map((id) => (
                    <QuizCard key={id} quizId={id} />
                ))}
                <Button onClick={createNewQuiz} variant="outlined" startIcon={<AddIcon />}>
                    new quiz
                </Button>
            </Stack>
            <Typography variant="h3" gutterBottom>
                My Curriculum
            </Typography>
            <Stack spacing={2}>
                {curriculumIds.map((id) => (
                    <CurriculumCard key={id} curriculumId={id} />
                ))}
                <Button onClick={createNewCurriculum} variant="outlined" startIcon={<AddIcon />}>
                    new curriculum
                </Button>
            </Stack>
            {/* <NewCurriculumDialog open={curriculumEditOpen} handleClose={} /> */}
        </Box>
    );
};

export default Home;
