import React, { useState } from "react";

// for ReactDOM.render(), e.g. ReactDOM.render(results, document.getElementById("results"));
// import ReactDOM from "react-dom";

import { useEffect } from "react";

import axios, {
  AxiosRequestConfig,
  // AxiosResponse
} from "axios";

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
  clearInput,
} from "../utils/methods";
// import { queryAPIStatus, renderEquivalents, getPromptLeftForm, getPromptRightForm, postInput, populatePrompt} from "./utils/api-calls";

// import logo from './logo.svg';

function Demo({
  host, 
  axiosConfig
}: {
  host: string;
  axiosConfig: AxiosRequestConfig
}) {
  // text input and input delta (added characters)
  const [input, setInput] = useState("");
  const [inputDelta, setInputDelta] = useState("");

  // left and right hand side interpretations of input
  const [lhsEquiv, setLhsEquiv] = useState("");
  const [rhsEquiv, setRhsEquiv] = useState("");

  // stores computed success state
  const [computed, setComputed] = useState(false);

  // stores sentence results
  const [results, setResults] = useState<string[] | undefined>();

  // const [target, setTarget] = useState<PickerData | undefined>();
  // const [targetId, setTargetId] = useState<number | undefined>();
  // const [targetValue, setTargetValue] = useState<string | undefined>();

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
  const [wpmTrue, setWpmTrue] = useState(0);

  const [errorRate, setErrorRate] = useState(0);

  const [totalWordCount, setTotalWordCount] = useState(0);

  const [notificationEnabled, setNotificationEnabled] = useState(true)

  // const [resultIndex, setResultIndex] = useState(null);

  // on page load
  useEffect(() => {
    // query API active state
    queryAPIStatus();

    // start elapsed time
    // alert("resetting start time")
    setStartTime(performance.now());

    // TODO: calculate non-selection wpm:
    setWpm(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // get left and right forms
    getPromptLeftForm();
    getPromptRightForm();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

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
    if (!apiActive) return;

    const emptyPrompt = prompt === "";
    if (emptyPrompt) {
      // if first time -> query text prompt
      populatePrompt();
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
    cleanPage()

    // query API status every second
    const interval = setInterval(() => {
      queryAPIStatus();
    }, 1000);
    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiActive]);

  let target: (PickerData | undefined);

  const InactiveApiNotification = ({hidden}: {hidden: boolean}) => (
    <div id='inactiveNotification' hidden={hidden}>
      Back-end services are inactive - apologies for any inconvenience
    </div>
  );

  return (
    <div className="App">

      <InactiveApiNotification
        hidden = {apiActive || !notificationEnabled}
      />

      <Header />

      {/* <hr /> */}

      <div id="content">

        {/* Sentence prompt */}
        <Prompt
          prompt={prompt}
          promptLHS={promptLHS}
          promptRHS={promptRHS}
          populatePrompt={populatePrompt}
        />

        {/* <hr /> */}
        <br />

        {/* Text input area (form) */}
        <TextInput
          input={input}
          apiActive={apiActive}
          sentenceSelectorHidden={
            results === [] || !results || results.length === 0 || !computed
          }
          handleOnInput={handleOnInput}
          queryAPIStatus={queryAPIStatus}
          addKeydownListener={addKeydownListener}
        />

        {/* <hr /> */}

        {/* Sentence wheel selector */}
        <SentenceSelector
          results={results}
          hidden={
            results === [] || !results || results.length === 0 || !computed
          }
          onChange={(targetArg) => {
            // edit top-level variable: target
            // note: all attempts to change state failed
            target = {
              id: targetArg.id,
              value: (targetArg.value as string).slice(4),
            };
            addKeydownListener();
          }}
        />

        {/* {OldResultsSelector()} */}
      </div>

      <Footer
        prompt={prompt}
        inputDelta={inputDelta}
        input={input}
        lhsEquiv={lhsEquiv}
        rhsEquiv={rhsEquiv}
        wpmTrue={wpmTrue}
        wpm={wpm}
        errorRate={errorRate}
        elapsedTime={elapsedTime}
      />
    </div>
  );

  function cleanPage() {
    // clear input, input delta
    clearInput(setInput, setInputDelta);

    // clear prompt
    setPrompt("");
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
      clearInput(setInput, setInputDelta);

      // populate new prompt
      populatePrompt();

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

    setNotificationEnabled(true);
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

  function postInput(input: string) {
    if (!input || input === "") {
      setComputed(false);
      return;
    }

    const path = "/get/submit";
    const url = host + path;

    let config: AxiosRequestConfig<string> = axiosConfig;
    config["params"] = {
      input: input,
    };

    axios.get(url, config).then(
      (response) => {
        // generate the results array
        const resultsArray = response.data;
        setResults(resultsArray);

        setComputed(true);
      },
      (error) => {
        console.log("Error: input submission failed")
        console.log(error);
        setComputed(false);
        setResults(undefined);
        queryAPIStatus();
      }
    );
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

        selectInputBox();
      },
      (error) => {
        console.log("Error");
        console.log(error);
        queryAPIStatus();
      }
    );
  }
}

export default Demo;
