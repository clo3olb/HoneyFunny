import * as React from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import type { NextPage } from "next";
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    FormControl,
    IconButton,
    InputLabel,
    Modal,
    Paper,
    Stack,
} from "@mui/material";
import useInputState from "../hooks/useInputState";
import Input from "./Input";
import RemoveIcon from "@mui/icons-material/RemoveCircle";
import AddIcon from "@mui/icons-material/Add";
import { COLLECTION_NAMES, getBaseProblem } from "../types";
import { useCurriculum } from "../hooks/useCurriculums";
import { useProblem } from "../hooks/useProblems";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const defaultProblem = {
    question: "",
    answer: "",
    choices: ["", "", ""],
};

type RowProps = {
    problemId: string;
};

const Row: NextPage<RowProps> = ({ problemId }) => {
    const [problem, updateProblem] = useProblem(problemId);

    const handleQuestionChange = (newQuestionState: string) => {
        if (!problem) return;
        updateProblem({ ...problem, question: newQuestionState });
    };
    const handleAnswerChange = (newAnswerState: string) => {
        if (!problem) return;
        updateProblem({ ...problem, answer: newAnswerState });
    };
    const getChoiceChangeHandler = (index: number) => {
        function handler(newChoiceState: string) {
            if (!problem) return;
            updateProblem({
                ...problem,
                choices: problem.choices.map((choice, i) => (i == index ? newChoiceState : choice)),
            });
        }
        return handler;
    };

    if (!problem) return <>"Loading Problem..."</>;

    return (
        <Paper>
            <Box padding={2}>
                <Stack direction="row" gap={1}>
                    <IconButton>
                        <RemoveIcon />
                    </IconButton>
                    <Input title="Question" value={problem.question} changeHandler={handleQuestionChange} />
                    <Input title="Answer" value={problem.answer} changeHandler={handleAnswerChange} />
                    {problem.choices.map((choice, i) => (
                        <Input
                            key={`Choice ${i + 1}`}
                            title={`Choice ${i + 1}`}
                            value={choice}
                            changeHandler={getChoiceChangeHandler(i)}
                        />
                    ))}
                </Stack>
            </Box>
        </Paper>
    );
};

type NewCurriculumDialogProps = {
    open: boolean;
    handleClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void) | undefined;
    curriculumId: string;
};

const NewCurriculumDialog: NextPage<NewCurriculumDialogProps> = ({ open, handleClose, curriculumId }) => {
    const [curriculum, updateCurriculum] = useCurriculum(curriculumId);

    const handleTitleChange = (newTitle: string) => {
        if (!curriculum) return;
        updateCurriculum({ ...curriculum, title: newTitle });
    };
    // const getProblemChangeHandler = (index: number) => {
    //     function handler(newProblemState: ProblemType) {
    //         setCurriculum(problems.map((problem, i) => (i == index ? newProblemState : problem)));
    //     }
    //     return handler;
    // };
    const handleAddProblem = () => {
        if (!curriculum) return;
        addDoc(collection(firestore, COLLECTION_NAMES.PROBLEMS), getBaseProblem()).then((doc) =>
            updateCurriculum({ ...curriculum, problemIds: [...curriculum.problemIds, doc.id] })
        );
    };

    if (!curriculum) return <>"Loading"</>;

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    <Input title="Curriculum Title" value={curriculum.title} changeHandler={handleTitleChange} />
                    {curriculum.problemIds.map((id, i) => (
                        <Row key={`Q-${i}`} problemId={id} />
                    ))}
                    <Button onClick={handleAddProblem} variant="outlined" startIcon={<AddIcon />}>
                        new question
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose}>Disagree</Button>
                <Button onClick={() => handleClose}>Agree</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewCurriculumDialog;
