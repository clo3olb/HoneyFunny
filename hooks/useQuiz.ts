import { User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../firebase/clientApp";
import { COLLECTION_NAMES, CurriculumType, getBaseUserInfo, QuizType, UserInfoType } from "../types";

export const useMyQuizzes = (user: User | null | undefined): [string[], (newQuizIds: string[]) => void] => {
    const [quizIds, setQuizIds] = useState<string[]>([]);

    const update = (newQuizIds: string[]) => {
        if (!user) return;
        updateDoc(doc(firestore, COLLECTION_NAMES.USERS, user.uid), { quizIds: newQuizIds });
    };

    useEffect(() => {
        if (!user) return;
        getDoc(doc(firestore, COLLECTION_NAMES.USERS, user.uid)).then((file) => {
            if (!file.exists()) {
                setDoc(doc(firestore, COLLECTION_NAMES.USERS, user.uid), getBaseUserInfo(user)).then(() => {});
            }
            onSnapshot(doc(firestore, COLLECTION_NAMES.USERS, user.uid), (doc) => {
                setQuizIds((doc.data() as UserInfoType).quizIds);
            });
        });
    }, [user]);

    return [user ? quizIds : [], update];
};

export const useQuiz = (id: string): [QuizType | null, (quiz: QuizType) => void] => {
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const update = (quiz: QuizType) => {
        updateDoc(doc(firestore, COLLECTION_NAMES.QUIZZES, id), quiz);
    };
    useEffect(() => {
        onSnapshot(doc(firestore, COLLECTION_NAMES.QUIZZES, id), (doc) => {
            setQuiz(doc.data() as QuizType);
        });
    }, []);
    return [quiz, update];
};
