import * as React from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import type { NextPage } from "next";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    FormControl,
    IconButton,
    InputLabel,
    Modal,
    Paper,
    Stack,
    TextField,
} from "@mui/material";
import useInputState from "../hooks/useInputState";
import Input from "./Input";
import RemoveIcon from "@mui/icons-material/RemoveCircle";
import AddIcon from "@mui/icons-material/Add";
import { COLLECTION_NAMES, CurriculumType, getBaseProblem } from "../types";
import { CurriculumWithIdType, useAllCurriculums, useCurriculum } from "../hooks/useCurriculums";
import { useProblem } from "../hooks/useProblems";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useQuiz } from "../hooks/useQuiz";
import { SyntheticEvent, useState } from "react";

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
    curriculumId: string;
};

const Row: NextPage<RowProps> = ({ curriculumId }) => {
    const [curriculum, update] = useCurriculum(curriculumId);

    if (!curriculum) return <>"Loading Problem..."</>;

    return (
        <Card>
            <CardHeader title={curriculum.title} subheader={`${curriculum.problemIds.length} questions`} />
        </Card>
    );
};

type EditQuizDialogProps = {
    open: boolean;
    handleClose: () => void;
    quizId: string;
};

const EditQuizDialog: NextPage<EditQuizDialogProps> = ({ open, handleClose, quizId }) => {
    const [quiz, update] = useQuiz(quizId);
    const curriculums = useAllCurriculums();
    const [newCurrValue, setNewCurrValue] = useState<CurriculumWithIdType | null>(null);

    const handleTitleChange = (newTitle: string) => {
        if (!quiz) return;
        update({ ...quiz, title: newTitle });
    };
    const handleDurationChange = (newDuration: string) => {
        if (!newDuration) newDuration = "0";
        if (isNaN(parseInt(newDuration))) return;
        if (!quiz) return;
        update({ ...quiz, duration: parseInt(newDuration) });
    };
    const handleNewCurrValueChange = (event: SyntheticEvent<Element, Event>, value: CurriculumWithIdType | null) => {
        console.log(value);
        setNewCurrValue(value);
    };
    const handleAddCurriculum = (curriculumId: string) => {
        if (!curriculumId) return;
        if (!quiz) return;
        update({ ...quiz, curriculumIds: [...quiz.curriculumIds, curriculumId] });
        setNewCurrValue(null);
    };

    if (!quiz) return <>"Loading"</>;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Edit Quiz</DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    <Input title="Quiz Title" value={quiz.title} changeHandler={handleTitleChange} />
                    <Input title="Duration(seconds)" value={"" + quiz.duration} changeHandler={handleDurationChange} />
                    {quiz.curriculumIds.map((id, i) => (
                        <Row key={`Q-${i}`} curriculumId={id} />
                    ))}
                    <Autocomplete
                        disablePortal
                        options={curriculums
                            .map((curriculum) => ({ ...curriculum, label: curriculum.title }))
                            .filter((curriculum) => !quiz.curriculumIds.find((id) => curriculum.id == id))}
                        value={newCurrValue}
                        onChange={handleNewCurrValueChange}
                        renderInput={(params) => (
                            <>
                                <TextField {...params} label="Curriculum" />
                                <Button onClick={() => handleAddCurriculum(newCurrValue?.id || "")}>ADD</Button>
                            </>
                        )}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>Done</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditQuizDialog;
