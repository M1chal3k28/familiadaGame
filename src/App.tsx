import { useEffect } from 'react';
import './Game'
import Game from './Game';
import { initQuestions } from './services/QuestionService';

function App() {
  useEffect(() => {
    initQuestions();
  }, []);

  return (
    <>
      <Game />
    </>
  );
};

export default App;