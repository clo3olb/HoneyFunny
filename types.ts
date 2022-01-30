import { User } from "firebase/auth";

export const COLLECTION_NAMES = {
    CURRICULUMS: "curriculums",
    PROBLEMS: "problems",
    USERS: "users",
    QUIZZES: "quizzes",
};

export type UserInfoType = {
    curriculumIds: string[];
    quizIds: string[];
    userId: string;
};

export function getBaseUserInfo(user: User) {
    const baseUserInfo: UserInfoType = {
        curriculumIds: [],
        userId: user.uid,
        quizIds: [],
    };
    return baseUserInfo;
}

export type QuizType = {
    title: string;
    duration: number;
    curriculumIds: string[];
    creatorId: string;
};
export function getBaseQuiz(user: User) {
    const baseQuiz: QuizType = {
        title: "Quiz Title",
        duration: 60,
        curriculumIds: [],
        creatorId: user.uid,
    };
    return baseQuiz;
}

export type ProblemType = {
    question: string;
    answer: string;
    choices: string[];
};
export function getBaseProblem() {
    const baseProblem: ProblemType = {
        question: "Sample Title",
        answer: "Sample Answer",
        choices: ["Choice 1", "Choice 2", "Choice 3"],
    };
    return baseProblem;
}

export type CurriculumType = {
    title: string;
    problemIds: string[];
    creatorId: string;
};

export function getBaseCurriculum(user: User) {
    const baseCurriculum: CurriculumType = {
        title: "",
        problemIds: [],
        creatorId: user.uid,
    };
    return baseCurriculum;
}
