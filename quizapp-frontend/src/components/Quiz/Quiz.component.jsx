import React, { useContext, useState, useEffect } from 'react';
import './Quiz.component.css'; // Import CSS styles
import { ENDPOINTS } from '../../api/urls.component';
import { get, post } from '../../api/requests.component';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from '../../context/LoginContext';

const QuizCreator = () => {
  const { id } = useParams(); // Pobieramy id quizu z URL
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quiz, setQuiz] = useState(null); // Stan do przechowywania danych quizu
  const [loading, setLoading] = useState(false); // Stan do kontrolowania ładowania
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswers, setCurrentAnswers] = useState([{ text: '', isCorrect: false }]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [visibility, setVisibility] = useState('private'); // 'private' or 'public'
  const navigate = useNavigate();
  const { token, setToken, user } = useContext(LoginContext);

  // Fetch quiz data for editing
useEffect(() => {
  if (id) {
    // Funkcja do pobierania danych quizu
    const fetchQuiz = async () => {
      setLoading(true);

      const onSuccess = (response, data) => {
        console.log('Quiz response:', data); // Loguj odpowiedź
        const quiz = data;
        setName(quiz.name);
        setDescription(quiz.description);
        setVisibility(quiz.status === 1 ? 'public' : 'private');
        setQuestions(quiz.questions.map(q => ({
          text: q.questionText,
          answers: q.answers.map(a => ({ text: a.answerText, isCorrect: a.correct })),
        })));
        toast.success('Quiz został załadowany.');
      };


      const onFail = (response) => {
          toast.error("Failed to fetch quiz!");
          toast.error("Error code: " + response.status);
      };

      await get(`${ENDPOINTS.GetQuizEdit}${id}`, onSuccess, onFail, token);
      setLoading(false);
  };

    fetchQuiz();
  }
}, [id, token]);


  const handleAddQuestion = () => {
    if (editingIndex >= 0) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = { text: currentQuestion, answers: currentAnswers };
      setQuestions(updatedQuestions);
      setEditingIndex(-1);
    } else {
      setQuestions([...questions, { text: currentQuestion, answers: currentAnswers }]);
    }
    resetCurrentQuestionAndAnswers();
  };

  const handleAddAnswer = () => {
    setCurrentAnswers([...currentAnswers, { text: '', isCorrect: false }]);
  };

  const handleChangeAnswer = (index, value) => {
    const newAnswers = [...currentAnswers];
    newAnswers[index].text = value;
    setCurrentAnswers(newAnswers);
  };

  const handleToggleCorrect = (index) => {
    const newAnswers = [...currentAnswers];
    newAnswers[index].isCorrect = !newAnswers[index].isCorrect;
    setCurrentAnswers(newAnswers);
  };

  const handleEditQuestion = (index) => {
    setCurrentQuestion(questions[index].text);
    setCurrentAnswers(questions[index].answers);
    setEditingIndex(index);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quiz = {
      quizId: id,
      name,
      description,
      status: visibility === 'public' ? 1 : 0, // 1 for public, 0 for private
      userId: user.user_id,
      questions: questions.map((question) => ({
        questionText: question.text,
        points: 10,
        weight: 1,
        answers: question.answers.map((answer) => ({
          answerText: answer.text,
          finished: null,
          correct: answer.isCorrect,
          weight: 1,
        })),
      })),
    };

    const onSuccess = () => {
      toast.success('Quiz został zapisany!');
      setName('');
      setDescription('');
      setQuestions([]);
      navigate('/quizzes');
    };

    try {
        await post(ENDPOINTS.CreateQuiz, quiz, onSuccess, null, token);
    } catch (error) {
      console.error('Błąd podczas zapisywania quizu:', error);
      toast.error('Nie udało się zapisać quizu.');
    }
  };

  const resetCurrentQuestionAndAnswers = () => {
    setCurrentQuestion('');
    setCurrentAnswers([{ text: '', isCorrect: false }]);
  };

  return (
    <div className="quiz-creator">
      <h2>{id ? 'Edytuj quiz' : 'Stwórz nowy quiz'}</h2>
      <form onSubmit={handleSubmit}>
        <section>
          <h3>Informacje o quizie</h3>
          <div>
            <label>Nazwa:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Wprowadź nazwę quizu"
              required
            />
          </div>
          <div>
            <label>Opis:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Krótki opis quizu"
              required
            />
          </div>
          <div>
            <label>Status:</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                />
                Prywatny
              </label>
              <label>
                <input
                  type="radio"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                />
                Publiczny
              </label>
            </div>
          </div>
        </section>

        <section>
          <h3>Dodaj pytania i odpowiedzi</h3>
          <div>
            <label>Pytanie:</label>
            <input
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Wprowadź treść pytania"
            />
            <button type="button" onClick={handleAddQuestion}>
              {editingIndex >= 0 ? 'Zaktualizuj pytanie' : 'Dodaj pytanie'}
            </button>
          </div>
          <div>
            <h4>Odpowiedzi:</h4>
            {currentAnswers.map((answer, index) => (
              <div key={index} className="answer-row">
                <input
                  type="text"
                  value={answer.text}
                  onChange={(e) => handleChangeAnswer(index, e.target.value)}
                  placeholder="Wprowadź odpowiedź"
                />
                <label>
                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={() => handleToggleCorrect(index)}
                  />
                  Poprawna odpowiedź
                </label>
                <button
                  type="button"
                  onClick={() => setCurrentAnswers(currentAnswers.filter((_, i) => i !== index))}
                >
                  Usuń
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddAnswer}>Dodaj odpowiedź</button>
          </div>
        </section>

        <button type="submit">Zapisz quiz</button>
      </form>

      <section>
        <h3>Dodane pytania:</h3>
        <ul>
          {questions.map((question, index) => (
            <li key={index}>
              <strong>{question.text}</strong>
              <ul>
                {question.answers.map((answer, i) => (
                  <li key={i}>
                    {answer.text} {answer.isCorrect && '(poprawna)'}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleEditQuestion(index)}>Edytuj</button>
              <button onClick={() => handleDeleteQuestion(index)}>Usuń</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default QuizCreator;
