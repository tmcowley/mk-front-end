import React, { useState, useEffect, useLayoutEffect } from "react"
import { useNavigate } from "react-router-dom"

// import local components
import Footer from "../components/Footer"
import Header from "../components/Header"
import Prompt from "../components/Prompt"
import TextInput from "../components/TextInput"
import SentenceSelector from "../components/SentenceSelector"

// see: https://www.npmjs.com/package/react-simple-wheel-picker
import { PickerData } from "react-simple-wheel-picker"

import {
  getStringDelta,
  countWords,
  selectInputBox,
} from "../utils/methods"

// import logo from './logo.svg'

import {
  isSignedIn as APIisLoggedIn,
  queryServiceStatus as APIqueryServiceStatus,
  getNextPhraseInSession as APIgetNextPhraseInSession,
  getRandomPhrase as APIgetRandomPhrase,
  submit as APIsubmit,
  getLeftEquivalent as APIgetLeftEquivalent,
  getRightEquivalent as APIgetRightEquivalent,
  getSessionNumber as APIgetSessionNumber,
  getPhraseNumber as APIgetPhraseNumber,
  getPhrasesPerSession as APIgetPhrasesPerSession,
  reportCompletedTrainingSession as APIreportCompletedTrainingSession,
} from "../utils/api-calls"
import {rightSide} from "../constants/constants"

// function Platform({
//   loggedIn
// }: {loggedIn: boolean}) {

function Platform() {

  const navigate = useNavigate()

  const [loggedIn, setLoggedIn] = useState(false)

  // text input and input delta (added characters)
  const [input, setInput] = useState("")
  const [inputLeft, setInputLeft] = useState("")
  const [inputRight, setInputRight] = useState("")
  const [inputDelta, setInputDelta] = useState("")

  // left and right-hand side interpretations of input

  // stores computed success state
  // const [computed, setComputed] = useState(false)

  // stores sentence results
  const [results, setResults] = useState([] as string[])

  // const [target, setTarget] = useState<PickerData | undefined>()
  // const [targetId, setTargetId] = useState<number | undefined>()
  // const [targetValue, setTargetValue] = useState<string | undefined>()

  // stores API active state
  const [apiActive, setApiActive] = useState(false)

  // stores text prompt
  const [prompt, setPrompt] = useState("")
  const [promptLeft, setPromptLeft] = useState("")
  const [promptRight, setPromptRight] = useState("")

  const [sessionNumber, setSessionNumber] = useState<number | undefined>(undefined)
  const [phraseNumber, setPhraseNumber] = useState<number | undefined>(undefined)

  const [phrasesPerSession, setPhrasesPerSession] = useState<number | undefined>(undefined)

  // metrics:

  // TODO:
  // stores wpm history, error rate history, elapsed times
  // const [metricHistory, setMetricHistory] = useState({})

  // elapsed time
  const [startTime, setStartTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  const [wpm, setWpm] = useState(0)
  const [wpmTrue, setWpmTrue] = useState(0)

  const [errorRate, setErrorRate] = useState(0)

  const [totalWordCount, setTotalWordCount] = useState(0)

  const [reportCompletedTrainingSession, setReportCompletedTrainingSession] = useState(false)
  // const [newSession, setNewSession] = useState(false)

  // const [resultIndex, setResultIndex] = useState(null)

  // on page load
  useLayoutEffect(() => {
    console.log("NOTICE: platform page loaded")
    APIisLoggedIn((response) => {
      setLoggedIn(response.data as boolean)
      console.log("logged in:" + response.data)
    })

    // query API active state
    queryServiceStatus()

    // set phrases per session constant
    APIgetPhrasesPerSession(
        (response) => {
          setPhrasesPerSession(response.data as number)
        }
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // on page load
  useEffect(() => {

    // start elapsed time
    // alert("resetting start time")
    setStartTime(performance.now())

    // TODO: calculate non-selection wpm:
    setWpm(0)

    // populate prompt
    getNextPhrase(loggedIn, phraseNumber as number, phrasesPerSession as number)
    selectInputBox()

    // refresh elapsed time every half-second
    // setInterval(() => {
    //   setElapsedTime(performance.now() - startTime)
    // }, 500)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

    if (loggedIn) refreshTrainingDataNumbers()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt])

  // on update of input => update stats, results
  useEffect(() => {
    // update metric: elapsed time
    setElapsedTime(performance.now() - startTime)

    if (input === "") {
      setInputLeft("")
      setInputRight("")
      setResults([])
      return
    }

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
    submit(input)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  // when the API becomes active
  useEffect(() => {
    // block inactive api state
    if (!apiActive) return

    const emptyPrompt = prompt === ""
    if (emptyPrompt) {
      // if first time -> query text prompt
      getNextPhrase(loggedIn, phraseNumber as number, phrasesPerSession as number)

      selectInputBox()
    }

    // focus-on and select input box
    selectInputBox()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiActive])

  // when the API becomes inactive
  useEffect(() => {
    // block active api state
    if (apiActive) return

    // clear input, results, prompt
    // clearPage()

    // navigate to status page
    // navigate("/status")

    // query API status every second
    const interval = setInterval(() => {
      queryServiceStatus()
    }, 1000)
    return () => clearInterval(interval)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiActive])

  useEffect(() => {
    // block active api state
    if (!reportCompletedTrainingSession) return

    // report completed training session
    APIreportCompletedTrainingSession(
        {
          speed: wpmTrue,
          accuracy: (100 - errorRate)
        },
        () => {
          console.log("APIreportCompletedTrainingSession succeeded")

          // reset metrics
          resetMetrics()

          // update session and phrase numbers
          refreshTrainingDataNumbers()
        }
    )

    setReportCompletedTrainingSession(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportCompletedTrainingSession])

  useEffect(() => {
    // block non-initial phrases
    if (phraseNumber !== 0) return

    // populate prompt
    console.log("\n\ninitial phrase detected -> call next phrase\n\n")

    // get new prompt
    getNextPhrase(loggedIn, phraseNumber as number, phrasesPerSession as number)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phraseNumber])

  // useEffect(() => {
  //   // block not new session state
  //   if (!newSession) return
  //
  //   console.log("\n\nnewSession hook called\n\n")
  //
  //   // get new prompt
  //   getNextPhrase(loggedIn, phraseNumber as number, phrasesPerSession as number)
  //
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [newSession])

  let target: PickerData | undefined

  return (
    <div className="App" id="App">
      <Header isLoggedIn={loggedIn} />

      {/* <hr /> */}

      <div id="content">
        {/* Sentence prompt */}
        <Prompt
          loggedIn={loggedIn}
          prompt={prompt}
          promptLeft={promptLeft}
          promptRight={promptRight}
          populatePrompt={getNextPhrase}
          clearPage={clearPage}
        />

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
            }
            addKeydownListener()
          }}
        />
      </div>
      <Footer
        loggedIn={loggedIn}
        prompt={prompt}
        inputDelta={inputDelta}
        input={input}
        inputLeft={inputLeft}
        inputRight={inputRight}
        wpmTrue={wpmTrue}
        wpm={wpm}
        errorRate={errorRate}
        elapsedTime={elapsedTime}
        sessionNumber={sessionNumber as number}
        phraseNumber={phraseNumber as number}
        phrasesPerSession={phrasesPerSession as number}
      />
    </div>
  )

  function refreshTrainingDataNumbers() {
    APIgetSessionNumber(
        (response) => {
          setSessionNumber(response.data as number)

          APIgetPhraseNumber(
              (response) => {
                setPhraseNumber(response.data as number)
              }
          )
        }
    )
  }

  /**
   * clear state related to: prompt, input, results
   */
  function clearPage() {
    
    // clear prompt-related fields
    setPrompt("")
    setPromptLeft("")
    setPromptRight("")

    // clear input-related fields
    const inputEl = (document.getElementById("input") as HTMLInputElement)
    if (inputEl !== null && inputEl !== undefined) inputEl.value = ""
    setInput("")
    setInputLeft("")
    setInputRight("")
    setInputDelta("")

    // clear results
    setResults([])
  }

  function handleOnInput(event: React.FormEvent<HTMLInputElement>) {
    queryServiceStatus()

    const oldValue = input
    const inputElement = event.target as HTMLInputElement
    const newValue = inputElement.value
    const selectionEnd = inputElement.selectionEnd!

    // calculate the input delta (new characters)
    const inputDelta = getStringDelta(oldValue, newValue, selectionEnd)

    // restrict keyboard sides
    const restrictRightSide = true
    const side = rightSide
    const characterOnRight = (element: string) => {
      return side.has(element)
    }
    const usesRightSide = inputDelta.split("").some(characterOnRight)
    if (restrictRightSide && loggedIn && usesRightSide) return

    setInputDelta(inputDelta)

    // update the state-stored input
    setInput(newValue)
  }

  function addKeydownListener() {
    removeKeydownListener();
    (
      document.getElementById("wheelPicker") as HTMLUListElement
    )?.addEventListener("keydown", handleKeydown)
  }

  function removeKeydownListener() {
    (
      document.getElementById("wheelPicker") as HTMLUListElement
    )?.removeEventListener("keydown", handleKeydown)
  }

  function handleKeydown(e: KeyboardEvent) {
    e.preventDefault()

    // listen for enter key
    if (e.key === "Enter") {
      console.log("enter detected")

      // check if chosen sentence matches prompt
      const correctChoice = (target?.value as string) === prompt
      if (correctChoice) {
        console.log("correct choice")
        handleCorrectChoice(loggedIn)
      } else {
        console.log("wrong choice")
        handleIncorrectChoice()
      }
      removeKeydownListener()
    }

    // listen for numeric entry
    // ...
    switch (e.key) {
      case "1":
        console.log("1")
        break
      case "2":
        console.log("2")
        break
      case "3":
        console.log("3")
        break
      case "4":
        console.log("4")
        break
      case "5":
        console.log("5")
    }

    function removeKeydownListener() {
      (
          document.getElementById("wheelPicker") as HTMLUListElement
      )?.removeEventListener("keydown", handleKeydown)
    }

    function handleCorrectChoice(loggedIn: boolean) {
      console.log("correct choice");

      // remove focus/ select
      (document.activeElement as HTMLLIElement).blur()

      // update metrics
      updateAllMetrics(prompt, true)

      // clear page
      clearPage()

      // populate new prompt
      getNextPhrase(loggedIn, phraseNumber as number, phrasesPerSession as number)

      // focus input box
      selectInputBox()

      // target = undefined

      removeKeydownListener()
    }

    function handleIncorrectChoice() {
      // update metrics
      updateAllMetrics(prompt, false)

      // target = undefined
    }
  }

  /** reset all metrics */
  function resetMetrics() {
    console.log("resetting metrics")
    setWpmTrue(0)
    setErrorRate(0)
    setTotalWordCount(0)
    setElapsedTime(0)
  }

  function updateAllMetrics(prompt: string, correct: boolean) {

    console.groupCollapsed("updating metrics")

    const promptWordCount = countWords(prompt)

    // recalculate wpm (true)
    {
      const msToMinutes = 1 / (Math.pow(10, 3) * 60)

      // get number of correct words
      let elapsedTimeMinutes = elapsedTime * msToMinutes
      console.log("elapsed minutes (not updated): " + elapsedTimeMinutes)
      let correctWordsCount = wpmTrue * elapsedTimeMinutes
      console.log("correct words count: " + correctWordsCount)

      elapsedTimeMinutes = (performance.now() - startTime) * msToMinutes
      console.log("elapsed minutes (updated): " + elapsedTimeMinutes)

      if (correct) correctWordsCount += promptWordCount

      console.log("Notice: setting wpmTrue")
      setWpmTrue(correctWordsCount / elapsedTimeMinutes)
    }

    // recalculate error rates
    {
      let totalWordCountLocal = totalWordCount
      let errorCount = (errorRate / 100) * totalWordCountLocal

      totalWordCountLocal += promptWordCount

      if (!correct) errorCount += promptWordCount

      console.log("Notice: setting error rate")
      setErrorRate((errorCount / totalWordCountLocal) * 100)
    }

    // recalculate totalWordCount, if correct
    console.log("Notice: setting totalWordCount")
    setTotalWordCount(totalWordCount + promptWordCount)

    // recalculate elapsedTime
    console.log("Notice: setting elapsedTime")
    if (correct) setElapsedTime(performance.now() - startTime)

    console.groupEnd()
  }

  // -----
  // API calls
  // -----

  /** query the api state */
  function queryServiceStatus() {
    APIqueryServiceStatus(
      () => {
        setApiActive(true)
      },
      () => {
        setApiActive(false)
        
        // clear input, results, prompt
        clearPage()

        // navigate to status page
        navigate("/status")
      }
    )
  }

  /** submit an input sentence */
  function submit(input: string) {
    APIsubmit(
      input,
      (response) => {
        const resultsArray = response.data as string[]
        setResults(resultsArray)
        // setComputed(true)
      },
      () => {
        setResults([])
        // setComputed(false)
        queryServiceStatus()
      }
    )
  }

  /** get the next phrase, chooses between next training phrase and a random one based on log-in state */
  function getNextPhrase(loggedIn: boolean, phraseNumber: number, phrasesPerSession: number) {
    if (loggedIn) {
      const onLastPhraseInSession = (phraseNumber === phrasesPerSession)
      if (onLastPhraseInSession) {
        // report completed session
        setReportCompletedTrainingSession(true)
        return
      }
      getNextPhraseInTraining()
    } else {
      getRandomPhrase()
    }
  }

  /** get the next phrase in the training session */
  function getNextPhraseInTraining() {
    console.log("Notice: Is logged in, getting next phrase in session")
    return APIgetNextPhraseInSession(
        (response) => {
          let prompt = response.data as string
          prompt = prompt.toLowerCase()
          setPrompt(prompt)
        },
        () => {
          queryServiceStatus()
        }
    )
  }

  /** get a random phrase (for demonstration page) */
  function getRandomPhrase() {
    return APIgetRandomPhrase(
      (response) => {
        let prompt = response.data as string
        prompt = prompt.toLowerCase()
        setPrompt(prompt)
      },
      () => {
        queryServiceStatus()
      }
    )
  }
}

export default Platform
