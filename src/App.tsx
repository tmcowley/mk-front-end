import { useState } from "react";

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import ReactDOM from "react-dom";

import { useEffect } from "react";

// import local components
import Footer from "./components/Footer";
import Header from "./components/Header";

// import logo from './logo.svg';

import "./App.css";

function App() {
  // text input and input delta (added characters)
  const [input, setInput] = useState("");
  const [inputDelta, setInputDelta] = useState("");

  // left and right hand side interpretations of input
  const [lhsEquiv, setLhsEquiv] = useState("");
  const [rhsEquiv, setRhsEquiv] = useState("");

  // stores computed success state
  const [computed, setComputed] = useState(false);

  // stores API active state
  const [apiActive, setApiActive] = useState(false);

  // stores text prompt
  const [prompt, setPrompt] = useState("");
  const [promptLHS, setPromptLHS] = useState("");
  const [promptRHS, setPromptRHS] = useState("");

  // metrics:

  // TODO: 
  // stores wpm history, error rate history, elapsed times
  // const [metricHistory, setMetricHistory] = useState({});

  // elapsed time
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [wpm, setWpm] = useState(0);

  const [errorRate, setErrorRate] = useState(0);

  const [totalWordCount, setTotalWordCount] = useState(0);

  // const [resultIndex, setResultIndex] = useState(null);

  // API & Axios config
  const axiosConfig: AxiosRequestConfig<string> = {
    headers: {
      // 'Content-Length': 0,
      "Content-Type": "text/plain",
    },
    responseType: "json",
  };
  // const host = "http://localhost:8080";
  const host = "https://mirrored-keyboard.herokuapp.com/";

  useEffect(() => {

    // get left and right forms
    getPromptLeftForm();

    getPromptRightForm();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]) 

  // on page load
  useEffect(() => {
    // query API active state
    queryAPIStatus();

    // start elapsed time
    // alert("resetting start time")
    setStartTime(performance.now());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // on update of input => update stats, results
  useEffect(() => {
    // update metric: elapsed time
    setElapsedTime(performance.now() - startTime);

    // calculate and render LHS and RHS interpretations
    renderEquivalents(input);

    // launch post request to get matching sentences
    postInput(input);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // when the API becomes active
  useEffect(() => {
    // block inactive api state
    if (!apiActive) {
      return;
    }

    const emptyPrompt = (prompt === "");
    if (emptyPrompt) {
      // if first time -> query text prompt
      populatePrompt();
    }

    // focus-on and select input box
    highlightInputBox();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiActive]);

  // when the API becomes inactive
  useEffect(() => {
    // block active api state
    if (apiActive) {
      return;
    }

    // query API status every second
    const interval = setInterval(() => {
      queryAPIStatus();
    }, 1000);
    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiActive]);

  return (
    <body className="App">
      <Header />

      <br />
      <hr />

      <div id="promptText">
        <p>
          {prompt === "" ? "Prompt goes here" : prompt.replaceAll(" ", "_")}
        </p>

        <button type="button" onClick={(_) => copyText(prompt)}>Copy</button>
        <button type="button" onClick={(_) => copyText(promptLHS)}>Copy LHS</button>
        <button type="button" onClick={(_) => copyText(promptRHS)}>Copy RHS</button>
        <button type="button" onClick={(_) => skipPrompt()}>
          Skip
        </button>
      </div>

      <hr />

      <div id="content">
        <form onSubmit={(e) => handleFormSubmit(e)} autoComplete="off">
          <label>
            <input
              id="input"
              type="text"
              value={input}
              onInput={(e) => handleOnInput(e)}
              onFocus={(_) => queryAPIStatus()}
              disabled={!apiActive}
            />
          </label>
        </form>

        <br />
        <hr />

        <div id="resultsContainer" hidden={input === "" || !computed}>
          <h2>Results</h2>
          <div className="grid-container">
            <div id="sentenceResults" className="grid-child" 
            // tabIndex={20} 
              onBlur={() => {handleResultsDivBlur()}}
            >
              <h3>Sentence-based algorithm (1)</h3>
              <ol id="results"></ol>
            </div>

            <div className="grid-child">
              <h3>Real-time algorithm (2)</h3>
              ...
            </div>
          </div>
        </div>

        <Footer
          inputDelta={inputDelta}
          input={input}
          lhsEquiv={lhsEquiv}
          rhsEquiv={rhsEquiv}
          wpm={wpm}
          errorRate={errorRate}
          elapsedTime={elapsedTime}
        />
      </div>
    </body>
  );

  function copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });

    // focus input box
    highlightInputBox();
  }

  function skipPrompt() {
    // cleanup page
    clearPage();

    // populate new prompt
    populatePrompt();

    // focus input box
    highlightInputBox();
  }

  function queryAPIStatus() {
    const path = "/get/status";
    const url = host + path;

    axios.get(url).then(
      (response) => {
        // console.log("queryAPIStatus() - Response found");
        // console.log(response);
        setApiActive(true);
      },
      (error) => {
        console.log("queryAPIStatus() - API endpoints down");
        // console.log(error);

        setApiActive(false);
      }
    );
  }

  function handleOnInput(event: React.FormEvent<HTMLInputElement>) {
    queryAPIStatus();

    const oldValue = input;
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;
    const selectionEnd = inputElement.selectionEnd!;

    // update the state-stored input
    setInput(newValue);

    // calculate the input delta (new characters)
    const inputDelta = getStringDelta(oldValue, newValue, selectionEnd);
    setInputDelta(inputDelta);
  }

  function renderEquivalents(input: string) {
    if (!input || input === "") {
      setLhsEquiv("");
      setRhsEquiv("");
    }

    // calculate lhs interpretation
    var path = "/get/convert/lhs";
    var url = host + path;

    let config: AxiosRequestConfig<string> = axiosConfig;
    config["params"] = {
      input: input,
    };

    axios.get(url, config).then(
      (response) => {
        // console.log(response);

        const lhsEquiv = response.data;
        setLhsEquiv(lhsEquiv);
      },
      (error) => {
        console.log(error);
        queryAPIStatus();
      }
    );

    path = "/get/convert/rhs";
    url = host + path;

    axios.get(url, config).then(
      (response) => {
        // console.log(response);

        const rhsEquiv = response.data;
        setRhsEquiv(rhsEquiv);
      },
      (error) => {
        console.log(error);
        queryAPIStatus();
      }
    );
  }

  function getPromptLeftForm() {
    // calculate lhs interpretation
    var path = "/get/convert/lhs";
    var url = host + path;

    let config: AxiosRequestConfig<string> = axiosConfig;
    config["params"] = {
      input: prompt,
    };

    axios.get(url, config).then(
      (response) => {
        // console.log(response);
        const result = response.data;

        setPromptLHS(result);
      },
      (error) => {
        console.log(error);
        queryAPIStatus();
      }
    );
  }

  function getPromptRightForm() {
    // calculate rhs interpretation
    var path = "/get/convert/rhs";
    var url = host + path;

    let config: AxiosRequestConfig<string> = axiosConfig;
    config["params"] = {
      input: prompt,
    };

    axios.get(url, config).then(
      (response) => {
        // console.log(response);

        const result = response.data;

        setPromptRHS(result);
      },
      (error) => {
        console.log(error);
        queryAPIStatus();
      }
    );
  }

  function updateAllMetrics(prompt: string, correct: boolean) {
    // recalculate wpm
    {
      const msToMins = 1 / (Math.pow(10, 3) * 60);
      
      // get number of correct words
      let elapsedTimeMins = elapsedTime * msToMins;
      console.log("elapsed mins (not updated): " + elapsedTimeMins);
      let correctWordsCount = wpm * elapsedTimeMins;
      console.log("correct words count: " + correctWordsCount)

      elapsedTimeMins = (performance.now() - startTime) * msToMins;
      console.log("elapsed mins (updated): " + elapsedTimeMins);

      if (correct) {
        correctWordsCount += countWords(prompt);
      }

      console.log("Notice: setting wpm");
      setWpm(correctWordsCount / elapsedTimeMins);
    }

    // recalculate error rates
    {
      let totalWordCountLocal = totalWordCount;
      let errorCount = (errorRate / 100) * totalWordCountLocal;

      totalWordCountLocal += countWords(prompt);

      if (!correct) {
        errorCount += countWords(prompt);
      }

      console.log("Notice: setting error rate");
      setErrorRate((errorCount / totalWordCountLocal) * 100);
    }

    // recalculate totalWordCount
    console.log("Notice: setting totalWordCount");
    setTotalWordCount(totalWordCount + countWords(prompt));

    // recalculate elapsedTime
    console.log("Notice: setting elapsedTime");
    setElapsedTime(performance.now() - startTime);
  }

  // https://stackoverflow.com/a/18679657/4440865
  function countWords(str: string) {
    return str.split(' ')
           .filter(function(n) { return n !== '' })
           .length;
}

  function handleElementSubmit(e: KeyboardEvent) {
    // listen for enter key
    if (e.key === "Enter") {
      // find current selected result
      let activeResult: HTMLLIElement = document.activeElement as HTMLLIElement;

      const correctResultChosen: boolean = activeResult.textContent === prompt;
      if (correctResultChosen) {
        handleCorrectResult();
      } else {
        handleIncorrectResult();
      }

      // listen for numeric entry
      // ...
    }
  }

  function handleCorrectResult() {
    console.log("CorrectResult");

    // update metrics
    updateAllMetrics(prompt, true);

    // cleanup page
    clearPage();

    // populate new prompt
    populatePrompt();

    // focus input box
    highlightInputBox();
  }

  function handleIncorrectResult() {
    console.log("IncorrectResult");

    // update metrics
    updateAllMetrics(prompt, false);
  }

  function handleResultsDivBlur() {
    // // when results div loses focus

    // // remove colour from div
    // decolourResultsDiv();

    // // autohighlight input box
    // highlightInputBox();
  }

  function handleFormSubmit(event: React.FormEvent) {
    // prevent default form submission
    event.preventDefault();

    // remove highlight from text input box
    unhighlightInputBox();

    // colour sentence based algorithm box
    colourResultsDiv();

    // get results div
    let resultsDiv: HTMLDivElement = (document.getElementById(
      "sentenceResults"
    ) as HTMLDivElement)!;

    // when focus is lost (aka on blur) -> decolour div
    // resultsDiv!!.onblur(e, (e) => {
    //   decolourResultsDiv();
    // })

    // highlight first sentence in list

    // get results (list elements) collection
    let resultsList = resultsDiv.querySelector("ol");
    let results: HTMLCollection = resultsList?.children!;

    // ensure there are results
    const noResults: boolean = results.length === 0;
    if (noResults) {
      // do nothing

      // re-highlight input box
      highlightInputBox();

      return;
    }

    // add event (keydown) listener to parent div
    // resultsDiv.addEventListener("keydown", (e) => handleElementSubmit(e));
    resultsDiv.addEventListener("keydown", handleElementSubmit);

    // listen for numeric entry
    // ...

    // highlight the first result
    const firstListEl: HTMLLIElement = results[0] as HTMLLIElement;
    firstListEl.focus();

    // for (let i = 0; i < results.length; i++) {
    //   let result = results[i].textContent;
    //   console.log(result)
    // }

    // setResultIndex(0);
  }

  function colourResultsDiv() {
    // colour sentence based algorithm box
    let resultsDiv: HTMLDivElement = (document.getElementById(
      "sentenceResults"
    ) as HTMLDivElement)!;
    resultsDiv.style.background = "lightblue";
  }

  function postInput(input: string) {
    if (!input || input === "") {
      setComputed(false);
      return;
    }

    const path = "/get/submit";
    const url = host + path;

    // const data = input;

    let config: AxiosRequestConfig<string> = axiosConfig;
    config["params"] = {
      input: input,
    };

    axios.get(url, config).then(
      (response) => {
        // render results from response
        renderResults(response);
        setComputed(true);
      },
      (error) => {
        console.log(error);
        setComputed(false);
        queryAPIStatus();
      }
    );
  }

  function renderResults(response: AxiosResponse) {
    // generate the results list
    const resultsArray = response.data;
    resultsArray.reverse();
    let results = resultsArray.map((item: string, i: number) => {
      return (
        <li tabIndex={i + 20} id={"li" + i} key={i}>
          {item}
        </li>
      );
    });

    // render the results list
    ReactDOM.render(results, document.getElementById("results"));
  }

  function clearPage() {
    // remove event listener from results div
    let resultsDiv: HTMLDivElement = (document.getElementById(
      "sentenceResults"
    ) as HTMLDivElement)!;
    resultsDiv.removeEventListener("keydown", handleElementSubmit);

    // clear input box, reset input
    clearInputBox();

    // remove highlighting from results div
    decolourResultsDiv();
  }

  function clearInputBox() {
    (document.getElementById("input") as HTMLInputElement).value = "";
    setInput("");
    setInputDelta("");
  }

  function populatePrompt() {
    // get new prompt, populate
    const path = "/get/random-phrase";
    const url = host + path;

    axios.get(url).then(
      (response) => {
        // set prompt text
        let prompt: string = response.data;
        prompt = prompt.toLowerCase();
        setPrompt(prompt);
      },
      (error) => {
        console.log("Error");
        console.log(error);
        queryAPIStatus();
      }
    );
  }

  function decolourResultsDiv() {
    // remove highlighting from results div
    let resultsDiv: HTMLDivElement = (document.getElementById(
      "sentenceResults"
    ) as HTMLDivElement)!;
    // resultsDiv.removeAttribute("style");
    resultsDiv.style.background = "white";
    resultsDiv.style.backgroundColor = "white";
    // resultsDiv.style.opacity = null;
  }

  function highlightInputBox() {
    // focus-on and select input box
    const inputElement: HTMLInputElement = document.getElementById(
      "input"
    )! as HTMLInputElement;
    inputElement.focus();
    inputElement.select();
  }

  function unhighlightInputBox() {
    // focus-on and select input box
    const inputElement: HTMLInputElement = document.getElementById(
      "input"
    )! as HTMLInputElement;
    inputElement.blur();
  }

  // Developed with help from https://stackoverflow.com/a/34217353
  function getStringDelta(
    oldString: string,
    newString: string,
    selEnd: number
  ) {
    const textLost: boolean = newString.length < oldString.length;
    if (textLost) {
      console.log("Notice: User has removed or cut character(s)");
      return "";
    }

    const deltaSize: number = newString.length - oldString.length;
    const selStart: number = selEnd - deltaSize;

    const isAppend: boolean = newString.substring(0, selStart) === oldString;

    if (isAppend) {
      return newString.substring(selStart, selEnd);
    } else {
      console.log("Notice: User has overwritten content");
      return "";
    }
  }
}

export default App;
