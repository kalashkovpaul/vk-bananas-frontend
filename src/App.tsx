import React from 'react';
import logo from './logo.svg';
import {Navbar} from './components/navbar/Navbar';
import {Sidebar} from './components/sidebar/Sidebar';
import {Page} from './components/page/Page';
import {Presentation} from './components/presentation/Presentation';
import {QuizEditor} from './components/quizEditor/QuizEditor';
import './App.css';

function App() {
  const [maxIndex, setMaxIndex] = React.useState(1);
  const [question, setQuestion] = React.useState("");
  const [options, setOptions] = React.useState(new Map);

  const onQuestionChange = (q: string) => {
    setQuestion(q);

  }

  // let options: Map<number, string> = new Map();
  return (
    <div className="App">
      {/* <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> */}
      <Navbar/>
      <Page>
        <Sidebar/>
        <Presentation/>
        <QuizEditor/>
      </Page>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
