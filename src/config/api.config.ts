const local = "http://localhost:3001"
const global = "http://185.241.192.112"

export const prefix = local;

// API: https://docs.google.com/document/d/1R1oVDwb69a-KeR4yAI94ou5osiNYdxRdfHzFL480f8M/edit

export const api = {
    presCreate: `${prefix}/presentation/create`,
    getPres: `${prefix}/presentation`,
    quizCreate: `${prefix}/quiz/create`,
    quizDelete: `${prefix}/quiz/delete`,
    quizUpdate: `${prefix}/quiz/update`,
    voteCreate: `${prefix}/quiz/vote/create`,
    voteUpdate: `${prefix}/quiz/vote/update`,
    voteDelete: `${prefix}/quiz/vote/delete`,
}