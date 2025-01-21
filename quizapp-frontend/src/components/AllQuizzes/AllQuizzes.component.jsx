import { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast';
import { get } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext';


const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]); // Stan do przechowywania quizów
    const [loading, setLoading] = useState(false); // Stan do kontrolowania ładowania
    const navigate = useNavigate(); // Hook do nawigacji między stronami
    const {token, setToken, user} = useContext(LoginContext);

    // Funkcja do pobrania quizów
    const fetchQuizzes = async () => {
        setLoading(true); // Ustawiamy loading na true podczas ładowania
    
        const onSuccess = (response, data) => {
            console.log("Quizzes data: ", data);
            setQuizzes(data); // Zapisujemy quizy w stanie
            toast.success('Quizzes fetched successfully!'); // Powiadomienie o powodzeniu
        };
    
        const onFail = (response) => {
            toast.error("Failed to fetch quizzes!");
            toast.error("Error code: " + response.status);
        };
    
        const userId = user.user_id; // Pobieramy userId z kontekstu
        if (!userId) {
            toast.error("User ID is not available");
            setLoading(false);
            return;
        }
    
        // Tworzymy URL z userId jako parametrem
        const urlWithUserId = `${ENDPOINTS.GetQuizzes}?userId=${userId}`;
    
        // Wykonaj zapytanie GET, aby pobrać quizy
        await get(urlWithUserId, onSuccess, onFail, token);
        setLoading(false); // Ustawiamy loading na false po zakończeniu
    };
    

    // Pobranie quizów po załadowaniu komponentu
    useEffect(() => {
        fetchQuizzes();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Available Quizzes</h1>

            {loading && <p>Loading...</p>} {/* Pokazuje loading podczas pobierania */}

            <div className="row">
                {quizzes.map((quiz, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{quiz.name}</h5>
                                <p className="card-text text-muted">{quiz.description}</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/quiz/attempt/${quiz.quizId}`)}
                                >
                                    Solve Quiz
                                </button>
                                {quiz.userId === user.user_id && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => navigate(`/quiz/${quiz.quizId}`)}
                                    >
                                        Edit Quiz
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizList;
