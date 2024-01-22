import { useEffect, useRef, useState } from "react"
import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [flag, setFlag] = useState(false)
  const [message,setMessage] = useState()
  const [score,setScore] = useState(0)
  const [quit,setQuit] = useState(false)

  let Option1 = useRef(null);
  let Option2 = useRef(null);
  let Option3 = useRef(null);
  let Option4 = useRef(null);

  let Option_array = [Option1, Option2, Option3, Option4];

  const apiUrl = "https://quizapi-production-ca3a.up.railway.app/question?api_key=06396e50-3e52-4fdf-b50c-f5a88041550b";

  async function getQuestions(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getQuestions(apiUrl);
  }, [apiUrl]);

  useEffect(() => {
    const highestScore = localStorage.getItem('highestScore')
    if(highestScore < score) {
      localStorage.setItem('highestScore', score);
    }
  }, [score]);

  function resetStyling() {
    Option_array.forEach((option) => {
      if (option.current) {
        option.current.classList.remove('right', 'wrong');
      }
    });
  }

  function changeQuestion() {
    if(currentQuestionIndex+1==questions.length) quitQuiz()
    setMessage()
    resetStyling();
    setFlag(false);
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  }

  function checkAnswer(e, answer) {
    if (flag === false) {
      if (questions[currentQuestionIndex].answer === answer) {
        e.target.classList.add('right');
        setScore(score+1)
      } else {
        e.target.classList.add('wrong');
        Option_array[questions[currentQuestionIndex].answer - 1].current.classList.add('right');
      }
      setFlag(true);
    }
  }
  function nextQuestion() {
    if(flag==true) changeQuestion()
    else setMessage("Please select the answer.")
  }
  function quitQuiz() {
    setQuit(true)
  }
  function replay() {
    setQuit(false)
    setCurrentQuestionIndex(0)
    setScore(0)
  }

  return (
    <>
    {!quit?
    <div className="container">
      <div className="h-div">
        <h1>Quiz App</h1>
        <h1>{score}</h1>
      </div>
      {questions.length > 0 && (
        <>
          <hr />
          <h2>{currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}</h2>
          <ul>
            <li ref={Option1} onClick={(e) => { checkAnswer(e, 1) }}>{questions[currentQuestionIndex].option1}</li>
            <li ref={Option2} onClick={(e) => { checkAnswer(e, 2) }}>{questions[currentQuestionIndex].option2}</li>
            <li ref={Option3} onClick={(e) => { checkAnswer(e, 3) }}>{questions[currentQuestionIndex].option3}</li>
            <li ref={Option4} onClick={(e) => { checkAnswer(e, 4) }}>{questions[currentQuestionIndex].option4}</li>
          </ul>
          <h3 className="message">{message}</h3>
          <div className="button-div">
            <button onClick={nextQuestion}>Next</button>
            <button onClick={quitQuiz}>Quit</button>
          </div>
          <div className="index">{currentQuestionIndex + 1} of {questions.length}</div>
        </>
      )}
    </div>
    :
    <div className="container quit">
      <div className="h-div">
        <h1>Quiz App</h1>
        <h2>Highest Score: <b>{localStorage.getItem('highestScore')}</b></h2>
      </div>
      <hr />
      <h2>You have completed the quiz!</h2>
      <h2>You got <b>{score}</b> out of <b>{questions.length}</b> questions.</h2>
      <button onClick={replay}>Replay</button>
    </div>
    }
    </>
  );
}

export default App;
