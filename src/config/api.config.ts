const local = "http://localhost:3001";
const global = "https://kindaslides.ru";//"http://185.241.192.112"
const localSite = "http://localhost:3000";
const globalSite = "https://kindaslides.ru"; //"http://185.241.192.112";

export const domain = global;
export const site = globalSite;

const apiVersion = "/api/v1"

export const prefix = `${domain}${apiVersion}`;

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
    login: `${prefix}/user/login`,
    logout: `${prefix}/user/logout`,
    register: `${prefix}/user/register`,
    checkAuth: `${prefix}/user/session`,
    getUser: `${prefix}/user`,
    getHash: `${prefix}/presentation/view/join`,
    getDemonstration: `${prefix}/presentation/view`,
    showGo: `${prefix}/presentation`,
    showStop: `${prefix}/presentation`,
    votePoll: `${prefix}/quiz/vote/poll`,
    reactionUpdate: `${prefix}/reactions/update`,
    askQuestion: `${prefix}/question/ask`,
    likeQuestion: `${prefix}/question/like`,
    setAvatar: `${prefix}/TODO`,
    getProfile: `${prefix}/profile`
}