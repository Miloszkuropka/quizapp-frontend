import { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast';
import { get } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import { LoginContext } from '../../context/LoginContext';

const QuizStatistics = () => {
    const [quizCount, setQuizCount] = useState(0);
    const { token, user } = useContext(LoginContext);
    const [publicQuizzes, setPublicQuizzes] = useState([]);
    const [privateQuizzes, setPrivateQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchQuizStatistics = async () => {
        setLoading(true);
    
        const onSuccess = (response, data) => {
            console.log("Quiz statistics: ", data);

            // Podziel quizy na prywatne i publiczne
            const publicQuizzes = data.filter((quiz) => quiz.status === "Public");
            const privateQuizzes = data.filter((quiz) => quiz.status === "Private");

            setPublicQuizzes(publicQuizzes);
            setPrivateQuizzes(privateQuizzes);

            // Ustaw całkowitą liczbę quizów
            setQuizCount(data.length);
        };
    
        const onFail = (response) => {
            toast.error("Failed to fetch quiz statistics!");
            toast.error("Error code: " + response.status);
        };
    
        const userId = user.user_id;
        if (!userId) {
            toast.error("User ID is not available");
            setLoading(false);
            return;
        }

        const urlWithUserId_s = `${ENDPOINTS.GetQuizStatistics}?userId=${userId}`;
        await get(urlWithUserId_s, onSuccess, onFail, token);
        setLoading(false);
    };

    useEffect(() => {
        fetchQuizStatistics();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Statistics:</h1>
            <div className="alert alert-info" role="alert">
                Total Quizzes: {quizCount}
            </div>

            {/* Sekcja dla quizów publicznych */}
            <h2 className="mt-4">Public Quizzes:</h2>
            {loading && <p>Loading...</p>}
            {!loading && publicQuizzes.length === 0 && <p>No public quizzes available.</p>}
            <div className="d-flex flex-wrap gap-3 mt-3">
                {publicQuizzes.map((quiz) => (
                    <div
                        key={quiz.quizId}
                        className="quiz-card border rounded shadow-sm p-2 text-center"
                        style={{
                            width: '150px',
                            height: '150px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <h6 className="mb-2 text-primary">{quiz.name}</h6>
                        <p className="text-muted small">{quiz.description}</p>
                        <p className="mb-0">Attempts: {quiz.total_attempts || 0}</p>
                        <p className="mb-0">Points: {quiz.total_points || 0}</p>
                    </div>
                ))}
            </div>

            {/* Sekcja dla quizów prywatnych */}
            <h2 className="mt-4">Private Quizzes:</h2>
            {loading && <p>Loading...</p>}
            {!loading && privateQuizzes.length === 0 && <p>No private quizzes available.</p>}
            <div className="d-flex flex-wrap gap-3 mt-3">
                {privateQuizzes.map((quiz) => (
                    <div
                        key={quiz.quizId}
                        className="quiz-card border rounded shadow-sm p-2 text-center"
                        style={{
                            width: '150px',
                            height: '150px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <h6 className="mb-2 text-primary">{quiz.name}</h6>
                        <p className="text-muted small">{quiz.description}</p>
                        <p className="mb-0">Attempts: {quiz.total_attempts || 0}</p>
                        <p className="mb-0">Points: {quiz.total_points || 0}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizStatistics;
