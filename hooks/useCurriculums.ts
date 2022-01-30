import { User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../firebase/clientApp";
import { COLLECTION_NAMES, CurriculumType, getBaseUserInfo, UserInfoType } from "../types";

export type CurriculumWithIdType = CurriculumType & { id: string };

export const useAllCurriculums = (): CurriculumWithIdType[] => {
    const [curriculums, setCurriculums] = useState<CurriculumWithIdType[]>([]);

    useEffect(() => {
        getDocs(collection(firestore, COLLECTION_NAMES.CURRICULUMS)).then((snapshots) => {
            setCurriculums(snapshots.docs.map((doc) => ({ id: doc.id, ...(doc.data() as CurriculumType) })));
        });
    }, []);

    return curriculums;
};

export const useMyCurriculums = (user: User | null | undefined): [string[], (newCurriculumIds: string[]) => void] => {
    const [curriculumIds, setCurriculums] = useState<string[]>([]);

    const update = (newCurriculumIds: string[]) => {
        if (!user) return;
        updateDoc(doc(firestore, COLLECTION_NAMES.USERS, user.uid), { curriculumIds: newCurriculumIds });
    };

    useEffect(() => {
        if (!user) return;
        getDoc(doc(firestore, COLLECTION_NAMES.USERS, user.uid)).then((file) => {
            if (!file.exists()) {
                setDoc(doc(firestore, COLLECTION_NAMES.USERS, user.uid), getBaseUserInfo(user)).then(() => {});
            }
            onSnapshot(doc(firestore, COLLECTION_NAMES.USERS, user.uid), (doc) => {
                setCurriculums((doc.data() as UserInfoType).curriculumIds);
            });
        });
    }, [user]);

    return [user ? curriculumIds : [], update];
};

export const useCurriculum = (id: string): [CurriculumType | null, (curriculum: CurriculumType) => void] => {
    const [curriculum, setCurriculum] = useState<CurriculumType | null>(null);
    const update = (curriculum: CurriculumType) => {
        updateDoc(doc(firestore, COLLECTION_NAMES.CURRICULUMS, id), curriculum);
    };
    useEffect(() => {
        onSnapshot(doc(firestore, COLLECTION_NAMES.CURRICULUMS, id), (doc) => {
            setCurriculum(doc.data() as CurriculumType);
        });
    }, []);
    return [curriculum, update];
};
