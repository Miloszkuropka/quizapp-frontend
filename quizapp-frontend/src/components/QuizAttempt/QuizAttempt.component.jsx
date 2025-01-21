import { useState, useEffect, useContext } from "react";
import toast from 'react-hot-toast';
import { useParams, useNavigate } from "react-router-dom";
import { get, post } from "../../api/requests.component";
import { ENDPOINTS } from "../../api/urls.component";
import "./QuizAttempt.component.css";
import { LoginContext } from '../../context/LoginContext';

function QuizAttempt() {
    const { id } = useParams(); // Pobieramy id quizu z URL
    const navigate = useNavigate(); // Hook do nawigacji między stronami
    const [quiz, setQuiz] = useState(null); // Stan do przechowywania danych quizu
    const [loading, setLoading] = useState(false); // Stan do kontrolowania ładowania
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Stan do przechowywania zaznaczonych odpowiedzi
    const {token, setToken, user} = useContext(LoginContext);

    // Funkcja do pobierania danych quizu
    const fetchQuiz = async () => {
        setLoading(true);

        const onSuccess = (response, data) => {
            setQuiz(data);
            toast.success("Quiz fetched successfully!");
        };

        const onFail = (response) => {
            toast.error("Failed to fetch quiz!");
            toast.error("Error code: " + response.status);
        };

        await get(`${ENDPOINTS.GetQuiz}${id}`, onSuccess, onFail, token);
        setLoading(false);
    };

    // Pobieranie quizu po załadowaniu komponentu
    useEffect(() => {
        fetchQuiz();
    }, [id]);

    // Funkcja do zaznaczania lub odznaczania odpowiedzi
    const handleAnswerToggle = (questionId, answerId) => {
        setSelectedAnswers((prev) => {
            const currentAnswers = prev[questionId] || [];
            if (currentAnswers.includes(answerId)) {
                // Jeśli odpowiedź jest już zaznaczona, odznacz ją
                return {
                    ...prev,
                    [questionId]: currentAnswers.filter((id) => id !== answerId),
                };
            } else {
                // Jeśli odpowiedź nie jest zaznaczona, dodaj ją
                return {
                    ...prev,
                    [questionId]: [...currentAnswers, answerId],
                };
            }
        });
    };

    // Funkcja do przesyłania odpowiedzi i nawigacji na stronę wyników
    const handleSubmit = async () => {
        // Przekształcenie selectedAnswers na format wymagany przez API
        const formattedQuestions = quiz.questions.map((question) => ({
            questionId: question.questionId,
            answers: question.answers.map((answer) => ({
                answerId: answer.answerId,
                correct: selectedAnswers[question.questionId]?.includes(answer.answerId) || false,
            })),
        }));
    
        const payload = {
            userId: user.user_id,
            quizId: quiz.quizId, // Zakładam, że quiz jest w stanie
            questions: formattedQuestions,
        };
    
        console.log(payload);
        // Funkcja do obsługi sukcesu
        const onSuccess = (response, data) => {
            const attemptId = data.attemptId; // Wyciągnięcie attemptId z odpowiedzi
            if (attemptId) {
                toast.success("Answers submitted successfully!");
                navigate(`/quiz-result/${attemptId}`, { state: { attemptId } }); // Nawigacja na stronę wyników z attemptId
            } else {
                toast.error("Invalid response format from server.");
            }
        };
    
        // Funkcja do obsługi błędów
        const onFail = (response) => {
            toast.error("Failed to submit answers!");
            toast.error("Error code: " + response.status);
        };
    
        // Wysłanie żądania do API
        await post(ENDPOINTS.SubmitQuiz, payload, onSuccess, onFail, token);
    };
    

    return (
        <div className="quiz-attempt-container">
            {loading && <p>Loading...</p>} {/* Pokazuje loading podczas pobierania */}

            {quiz && (
                <div>
                    <h1>{quiz.name}</h1>
                    <p>{quiz.description}</p>

                    {/* Wyświetlanie pytań i odpowiedzi */}
                    {quiz.questions.map((question, index) => (
                        <div key={question.questionId} className="question-container">
                            <h2>{index + 1}. {question.questionText}</h2>
                            <ul className="answers-list">
                                {question.answers.map((answer) => {
                                    const isSelected = selectedAnswers[question.questionId]?.includes(answer.answerId);
                                    const answerClass = isSelected ? 'answer-item selected' : 'answer-item';

                                    return (
                                        <li
                                            key={answer.answerId}
                                            className={answerClass}
                                            onClick={() => handleAnswerToggle(question.questionId, answer.answerId)}
                                        >
                                            {answer.answerText}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}

                    {/* Przycisk do zatwierdzenia odpowiedzi */}
                    <button className="submit-button" onClick={handleSubmit}>
                        Zatwierdź odpowiedzi
                    </button>
                </div>
            )}

            {!loading && !quiz && <p>Quiz not found!</p>} {/* Wiadomość, gdy quiz nie został znaleziony */}
        </div>
    );
}

export default QuizAttempt;
