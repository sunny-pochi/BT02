(() => {

  const API_URL = 'https://opentdb.com/api.php?amount=10';

  const quizQuestion = {
    quizzes: [],
    currentIndex: 0,
    numberOfCorrects: 0
  };

  const guide = document.getElementById('guide');

  const announce = document.getElementById('announce');
  const question = document.getElementById('question');
  const startButton = document.getElementById('start-button');
  const answersContainer = document.getElementById('answers');
  const genreP = document.getElementById('genre');
  const difficultyP = document.getElementById('difficulty');


  startButton.addEventListener('click', (event) => {
    fetchQuizData();
  });

  const fetchQuizData = async () => {
    guide.textContent = '取得中';
    announce.textContent = '少々お待ちください';
    question.innerHTML = '';
    startButton.hidden = true;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      console.log(response);
      console.log(data);

      quizQuestion.quizzes = data.results;
      quizQuestion.currentIndex = 1;
      quizQuestion.numberOfCorrects = 0;

      setNextQuiz();
    } catch (error) {
      console.log('エラー : ', error);
    }
  };

  const setNextQuiz = () => {

    guide.textContent = `問題${quizQuestion.currentIndex}`;
    announce.textContent = '';
    removeAllAnswers();

    if (quizQuestion.currentIndex < quizQuestion.quizzes.length) {
      // 次のクイズ
      const quiz = quizQuestion.quizzes[quizQuestion.currentIndex];
      makeQuiz(quiz);

    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    guide.textContent = `あなたの正答数は${quizQuestion.numberOfCorrects}です`
    genreP.innerHTML = '';
    difficultyP.innerHTML =  '';
    question.innerHTML = '再度チャレンジしたい場合は以下をクリック！！';

    startButton.innerText = 'ホームへ戻る';
    startButton.hidden = false;

  };

  const removeAllAnswers = () => {
    while(answersContainer.firstChild) {
      answersContainer.removeChild(answersContainer.firstChild);
    }
  };


  const makeQuiz =(quiz) => {

    genreP.innerHTML = `[ジャンル]${quiz.category}`;
    difficultyP.innerHTML = `[難易度]${quiz.difficulty}`;

    question.innerHTML= quiz.question;
    const answers = buildAnswers(quiz);


    answers.forEach((answer) => {
      const liButton = document.createElement('button');
      liButton.innerText = answer;
      answersContainer.appendChild(liButton);
      liButton.addEventListener('click', (event) => {
        const correctAnswer = quiz.correct_answer;
        if (correctAnswer === liButton.textContent) {
          quizQuestion.numberOfCorrects++;
        }

        quizQuestion.currentIndex++;
        setNextQuiz();

      });
    });
  };


  const buildAnswers = (quiz) => {
    const answers = [
      quiz.correct_answer,
      ...quiz.incorrect_answers
    ];

    return shuffle(answers);
  };


  const shuffle = (array) => {
    const copiedArray = array.slice();
    for (let i = copiedArray.length - 1; i >= 0; i--){
      const rand = Math.floor(Math.random() * (i + 1));
      [copiedArray[i], copiedArray[rand]] = [copiedArray[rand], copiedArray[i]];
    }

    return copiedArray;
  };

})();
