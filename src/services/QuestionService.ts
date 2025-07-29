import { Question, QuestionType, Answer, QuestionMeta, WhatTeam } from "../Types";

// Functions to prepare questions for the game

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
export const prepareQuestions = (array: Question[]): Question[] => {
    const processed = array.map((q) => ({
        ...q,
        answers: sortAnswersByScore(q.answers),
    }));

    processed.map((q) => {
        q.questionMeta = getQuestionMeta(q);
    });

    return sortByIdAndType(processed);
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

    // Get code of the most scored answer
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
