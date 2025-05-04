import { Question, QuestionType, Answer, QuestionMeta, WhatTeam } from "../Types";

// Primitive version of question service
// TODO: Build a real question service where questions can be added and removed by user
const STORAGE_KEY = "questions";

/**
 * Retrieves the questions stored in local storage.
 * @returns The array of questions stored in local storage.
 */
export const getQuestions = (): Question[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

/**
 * Sorts array of questions by their type and id.
 * First, sorts by type. If types are different, questions with type "hard" are placed after questions with type "normal".
 * If types are the same, sorts by id.
 * 
 * EXAMPLE
 * 
 * FROM:
 * normal1 - hard2 - normal3 - hard4
 * TO:
 * normal1 - normal3 - hard2 - hard4
 */
const sortByIdAndType = (array: Question[]): Question[] => {
    return array.sort((a: Question, b: Question): number => {
        if (a.type != b.type && a.type === QuestionType.HARD) return 1;
        if (a.type != b.type && a.type === QuestionType.NORMAL) return -1;
        return a.id - b.id;
    });
};

/**
 * 
 * @param array - The array of answers to be sorted.
 * @returns A new array of answers sorted by their score in descending order.
 */
const sortAnswersByScore = (array: Answer[]): Answer[] => {
    return array.slice().sort(
        (a: Answer, b: Answer) => b.score - a.score
    ).map((answer) => ({
        ...answer,
        revealed: false,
        revealedByTeam: WhatTeam.TO_BE_DETERMINED
    }));
};

/**
 * Prepares a list of questions by sorting their answers by score and
 * then sorting the questions by their type and id.
 * 
 * @param array - The array of questions to be prepared.
 * @returns A new array of questions with answers sorted by score
 *          and questions sorted by type and id.
 */
const prepareQuestions = (array: Question[]): Question[] => {
    const processed = array.map((q) => ({
        ...q,
        answers: sortAnswersByScore(q.answers),
        questionMeta: getQuestionMeta(q)
    }));
    return sortByIdAndType(processed);
};

/**
 * Stores the provided array of questions in local storage.
 * The questions are first prepared by sorting their answers by score
 * and sorting the questions by their type and id.
 * 
 * @param questions - The array of questions to be stored.
 */
export const setQuestions = (questions: Question[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
};

/**
 * Initializes the question service.
 * 
 * The function first loads a JSON file with questions from the server and
 * then stores the questions in local storage after preparing them by sorting
 * their answers by score and sorting the questions by type and id.
 * 
 * @returns A promise that resolves when the operation is complete.
 */
export const initQuestions = async (): Promise<void> => {
    // TODO: Make this load only once
    // Load from json (for now)
    // const saved = localStorage.getItem(STORAGE_KEY);
    // if (!saved) {
    //     const res = await fetch(`/${STORAGE_KEY}.json`);
    //     const data = await res.json();
    //     setQuestions(data);
    // }

    const res = await fetch(`/${STORAGE_KEY}.json`);
    const data = await res.json();
    const processed = prepareQuestions(data);
    setQuestions(processed);
};

/**
 * Computes metadata about a given question.
 * 
 * The function calculates the number of answers, identifies the longest answer,
 * and determines the code of the answer with the highest score.
 * 
 * @param question - The question to compute metadata for.
 * @returns An object containing:
 *          - answerCount: The total number of answers the question has.
 *          - longestAnswer: The length of the longest answer's code.
 *          - mostScoredAnswerCode: The code of the answer with the highest score.
 */
export const getQuestionMeta = (question: Question): QuestionMeta => {
    // Calculate the length of the longest answer's code
    const longestAnswer = question.answers.length > 0
        ? question.answers.reduce((a: Answer, b: Answer) => a.code.length > b.code.length ? a : b).code.length
        : 0;

    // Get the code of the answer with the highest score
    const mostScoredAnswerCode = question.answers.length > 0
        ? question.answers[0].code
        : "";

    // Return the metadata object
    return {
        answerCount: question.answers.length,
        longestAnswer,
        mostScoredAnswerCode,
        answersRevealed: 0
    };
};
