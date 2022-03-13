import React, { useState, useEffect } from "react";

// import local components
import Footer from "../components/Footer";
import Header from "../components/Header";
import Prompt from "../components/Prompt";
import TextInput from "../components/TextInput";
import SentenceSelector from "../components/SentenceSelector";

// see: https://www.npmjs.com/package/react-simple-wheel-picker
import { PickerData } from "react-simple-wheel-picker";

import {
  getStringDelta,
  countWords,
  selectInputBox,
} from "../utils/methods";

// import logo from './logo.svg';

import {
  queryServiceStatus as APIqueryServiceStatus,
  getRandomPhrase as APIgetRandomPhrase,
  submit as APIsubmit, 
  getLeftEquivalent as APIgetLeftEquivalent, 
  getRightEquivalent as APIgetRightEquivalent
} from "../utils/api-calls";

function Platform({
  loggedIn
}: {loggedIn: boolean}) {
  // text input and input delta (added characters)
  const [input, setInput] = useState("");
  const [inputLeft, setInputLeft] = useState("");
  const [inputRight, setInputRight] = useState("");
  const [inputDelta, setInputDelta] = useState("");

  // left and right hand side interpretations of input

  // stores computed success state
  // const [computed, setComputed] = useState(false);

  // stores sentence results
  const [results, setResults] = useState([] as string[]);

  // const [target, setTarget] = useState<PickerData | undefined>();
  // const [targetId, setTargetId] = useState<number | undefined>();
  // const [targetValue, setTargetValue] = useState<string | undefined>();

  // stores API active state
  const [apiActive, setApiActive] = useState(false);

  // stores text prompt
  const [prompt, setPrompt] = useState("");
  const [promptLeft, setPromptLeft] = useState("");
  const [promptRight, setPromptRight] = useState("");

  // metrics:

  // TODO:
  // stores wpm history, error rate history, elapsed times
  // const [metricHistory, setMetricHistory] = useState({});

  // elapsed time
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [wpm, setWpm] = useState(0);
  const [wpmTrue, setWpmTrue] = useState(0);

  const [errorRate, setErrorRate] = useState(0);

  const [totalWordCount, setTotalWordCount] = useState(0);

  // const [resultIndex, setResultIndex] = useState(null);

  // on page load
  useEffect(() => {
    // query API active state
    queryServiceStatus();

    // start elapsed time
    // alert("resetting start time")
    setStartTime(performance.now());

    // TODO: calculate non-selection wpm:
    setWpm(0);

    // populate prompt
    getRandomPhrase();
    selectInputBox();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set prompt left and right forms
    APIgetLeftEquivalent(
      prompt, 
      (response) => {
        setPromptLeft(response.data as string)
      }
    )
    APIgetRightEquivalent(
      prompt, 
      (response) => {
        setPromptRight(response.data as string)
      }
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  // on update of input => update stats, results
  useEffect(() => {
    // update metric: elapsed time
    setElapsedTime(performance.now() - startTime);

    // calculate and render LHS and RHS interpretations
    APIgetLeftEquivalent(
      input, 
      (response) => {
        setInputLeft(response.data as string)
      }
    )
    APIgetRightEquivalent(
      input, 
      (response) => {
        setInputRight(response.data as string)
      }
    )

    // submit to get results
    submit(input);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // when the API becomes active
  useEffect(() => {
    // block inactive api state
    if (!apiActive) return;

    const emptyPrompt = prompt === "";
    if (emptyPrompt) {
      // if first time -> query text prompt
      getRandomPhrase();

      selectInputBox();
    }

    // focus-on and select input box
    selectInputBox();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiActive]);

  // when the API becomes inactive
  useEffect(() => {
    // block active api state
    if (apiActive) return;

    // clear input, results, prompt
    clearPage();

    // query API status every second
    const interval = setInterval(() => {
      queryServiceStatus();
    }, 1000);
    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiActive]);

  let target: PickerData | undefined;

  return (
    <div className="App" id="App">
      <Header isLoggedIn={loggedIn} />

      {/* <hr /> */}

      <div id="content">
        {/* Sentence prompt */}
        <Prompt
          prompt={prompt}
          promptLeft={promptLeft}
          promptRight={promptRight}
          populatePrompt={getRandomPhrase}
          clearPage={clearPage}
        />

        {/* <hr /> */}
        <br />

        {/* Text input area (form) */}
        <TextInput
          input={input}
          apiActive={apiActive}
          sentenceSelectorHidden={
            // results === [] || !results || results.length === 0 || !computed
            input === ""
          }
          handleOnInput={handleOnInput}
          queryServiceStatus={queryServiceStatus}
          addKeydownListener={addKeydownListener}
        />

        {/* <hr /> */}

        {/* Sentence wheel selector */}
        <SentenceSelector
          results={results}
          onChange={(targetArg) => {
            target = {
              id: targetArg.id,
              value: (targetArg.value as string).slice(4),
            };
            addKeydownListener();
          }}
        />
      </div>
      <Footer
        prompt={prompt}
        inputDelta={inputDelta}
        input={input}
        inputLeft={inputLeft}
        inputRight={inputRight}
        wpmTrue={wpmTrue}
        wpm={wpm}
        errorRate={errorRate}
        elapsedTime={elapsedTime}
      />
    </div>
  );

  /**
   * clear state related to: prompt, input, results
   */
  function clearPage() {
    
    // clear prompt-related fields
    setPrompt("")
    setPromptLeft("")
    setPromptRight("");

    // clear input-related fields
    (document.getElementById("input") as HTMLInputElement).value = ""
    setInput("")
    setInputLeft("")
    setInputRight("")
    setInputDelta("")

    // clear results
    setResults([])
  }

  function handleOnInput(event: React.FormEvent<HTMLInputElement>) {
    queryServiceStatus();

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

  function addKeydownListener() {
    removeKeydownListener();
    (
      document.getElementById("wheelPicker") as HTMLUListElement
    )?.addEventListener("keydown", handleKeydown);
  }

  function removeKeydownListener() {
    (
      document.getElementById("wheelPicker") as HTMLUListElement
    )?.removeEventListener("keydown", handleKeydown);
  }

  function handleKeydown(e: KeyboardEvent) {
    e.preventDefault();

    // listen for enter key
    if (e.key === "Enter") {
      console.log("enter detected");

      // check if chosen sentence matches prompt
      const correctChoice = (target?.value as string) === prompt;
      if (correctChoice) {
        console.log("correct choice");
        handleCorrectChoice();
      } else {
        console.log("wrong choice");
        handleIncorrectChoice();
      }
    }

    // listen for numeric entry
    // ...
    switch (e.key) {
      case "1":
        console.log("1");
        break;
      case "2":
        console.log("2");
        break;
      case "3":
        console.log("3");
        break;
      case "4":
        console.log("4");
        break;
      case "5":
        console.log("5");
    }

    function handleCorrectChoice() {
      console.log("correct choice");

      // remove focus/ select
      (document.activeElement as HTMLLIElement).blur();

      // update metrics
      updateAllMetrics(prompt, true);

      // clear page
      clearPage()

      // populate new prompt
      getRandomPhrase();

      // focus input box
      selectInputBox();

      target = undefined;

      removeKeydownListener();
    }

    function handleIncorrectChoice() {
      // update metrics
      updateAllMetrics(prompt, false);

      target = undefined;
    }
  }

  function updateAllMetrics(prompt: string, correct: boolean) {
    // recalculate wpm (true)
    {
      const msToMins = 1 / (Math.pow(10, 3) * 60);

      // get number of correct words
      let elapsedTimeMins = elapsedTime * msToMins;
      console.log("elapsed mins (not updated): " + elapsedTimeMins);
      let correctWordsCount = wpmTrue * elapsedTimeMins;
      console.log("correct words count: " + correctWordsCount);

      elapsedTimeMins = (performance.now() - startTime) * msToMins;
      console.log("elapsed mins (updated): " + elapsedTimeMins);

      if (correct) correctWordsCount += countWords(prompt);

      console.log("Notice: setting wpmTrue");
      setWpmTrue(correctWordsCount / elapsedTimeMins);
    }

    // recalculate error rates
    {
      let totalWordCountLocal = totalWordCount;
      let errorCount = (errorRate / 100) * totalWordCountLocal;

      totalWordCountLocal += countWords(prompt);

      if (!correct) errorCount += countWords(prompt);

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

  // -----
  // API calls
  // -----

  function queryServiceStatus() {
    APIqueryServiceStatus(
      (response) => {
        setApiActive(true);
      },
      (error) => {
        setApiActive(false);
      }
    );
  }

  function submit(input: string) {
    APIsubmit(
      input,
      (response) => {
        const resultsArray = response.data as string[];
        setResults(resultsArray);
        // setComputed(true);
      },
      (error) => {
        setResults([]);
        // setComputed(false);
        queryServiceStatus();
      }
    );
  }

  function getRandomPhrase() {
    return APIgetRandomPhrase(
      (response) => {
        let prompt = response.data as string;
        prompt = prompt.toLowerCase();
        setPrompt(prompt);
      },
      (error) => {
        queryServiceStatus();
      }
    );
  }
}

export default Platform;
