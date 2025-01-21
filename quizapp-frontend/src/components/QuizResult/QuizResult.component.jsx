import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../api/requests.component"; // Assuming your custom 'get' function
import { ENDPOINTS } from "../../api/urls.component";
import toast from "react-hot-toast";
import "./QuizResult.component.css";
import { LoginContext } from '../../context/LoginContext';

function QuizResult() {
    const { attemptId } = useParams(); // Retrieve attemptId from URL
    const [result, setResult] = useState(null); // State to store the result data
    const [loading, setLoading] = useState(true); // State for loading state
    const [error, setError] = useState(null); // State for storing error messages
    const {token, setToken, user} = useContext(LoginContext);

    useEffect(() => {
        const fetchAttemptData = async () => {
                // Funkcja do obsługi sukcesu
            const onSuccess = (response, data) => {
                 console.log('API Response:', data);
                if (data) {
                    console.log('API Response:', data);
                    setResult(data); // Set the result data if available
                } else {
                        setError('Unexpected response format');
                        toast.error("Failed to load quiz result");
                    }
                    setLoading(false);
            };
            const onFail = (response, data) => {
                    setLoading(false);
                    toast.error("Failed to load quiz result");
            };
                const response = await get(`${ENDPOINTS.GetAttempt}${attemptId}`, onSuccess, onFail, token);
           
        };

        fetchAttemptData();
    }, [attemptId]);

    // Display loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display error message if something went wrong
    if (error) {
        return <div>Error: {error}</div>;
    }

    // If there's no result data, show an error message
    if (!result) {
        return (
            <div className="quiz-result-container">
                <h1>Quiz Result</h1>
                <p>Unable to load quiz results. Please try again.</p>
            </div>
        );
    }

    // Show the quiz result when data is available
    return (
        <div className="quiz-result-container">
            <h1>Quiz Result</h1>
            <p>Attempt ID: <strong>{attemptId}</strong></p>
            <p>Total Points: <strong>{result.points}</strong></p>
            <p>Finished: <strong>{result.finished ? 'Yes' : 'No'}</strong></p>
            <p>Date: <strong>{new Date(result.date).toLocaleDateString()}</strong></p>
        </div>
    );
}

export default QuizResult;
