export const BASE_URL = "http://127.0.0.1:8000"

export const ENDPOINTS = {
    Register: BASE_URL + "/api/api/user/register/",
    Login: BASE_URL + "/api/api/token/",
    GetUsers: BASE_URL + "/api/users/",
    GetQuizzes: BASE_URL + "/api/quizzes/",
    GetQuiz: BASE_URL + "/api/quiz/",
    CreateQuiz: BASE_URL + "/api/quizzes/create/",
    SubmitQuiz: BASE_URL + "/api/quiz/submit/",
    GetAttempt: BASE_URL + "/api/attempts/",
    GetUserDetails: BASE_URL + "/api/user/:userId/",
    UpdateUser: BASE_URL + "/api/updateuser/:userId/",
    DeleteUser: BASE_URL + "/api/deleteuser/:userId/",
    GetLogs: BASE_URL + '/api/logs/getlogs',
    ForgotPassword: BASE_URL + '/api/changepassword/',
    ResetPassword: BASE_URL + '/api/resetpassword/',
    GetQuizEdit: BASE_URL + "/api/quiz_for_edit/",
    GetQuizStatistics: BASE_URL + '/api/quiz-statistics/',
    CheckAdminStatus: BASE_URL + "/api/is-admin/",
}