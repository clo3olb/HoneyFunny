import {
    collection,
    doc,
    DocumentData,
    getDocs,
    onSnapshot,
    QueryDocumentSnapshot,
    updateDoc,
} from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { firestore } from "../firebase/clientApp";
import { COLLECTION_NAMES, ProblemType } from "../types";

export const useProblems = () => {
    const [problems, setProblems] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
    useEffect(() => {
        getDocs(collection(firestore, COLLECTION_NAMES.CURRICULUMS)).then((snapshot) => {
            setProblems(snapshot.docs.map((doc) => doc));
        });
    }, []);
    return problems;
};

export const useProblem = (id: string): [ProblemType | null, (problem: ProblemType) => void] => {
    const [problem, setProblem] = useState<ProblemType | null>(null);
    const update = (problem: ProblemType) => {
        updateDoc(doc(firestore, COLLECTION_NAMES.PROBLEMS, id), problem);
    };
    useEffect(() => {
        onSnapshot(doc(firestore, COLLECTION_NAMES.PROBLEMS, id), (doc) => {
            setProblem(doc.data() as ProblemType);
        });
    }, []);
    return [problem, update];
};
