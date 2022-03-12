import React from "react";
import { blurInputBox } from "../utils/methods";

type TextInputProps = {
  input: string;
  apiActive: boolean;
  sentenceSelectorHidden: boolean;
  handleOnInput: Function;
  queryServiceStatus: Function;
  addKeydownListener: Function;
};

function TextInput({
  input,
  apiActive,
  sentenceSelectorHidden,
  handleOnInput,
  queryServiceStatus,
  addKeydownListener,
}: TextInputProps) {
  return (
    <form
      onSubmit={(e) => handleFormSubmit(e)}
      onKeyDown={(e) => handleKeyDown(e)}
      autoComplete="off"
    >
      <label>
        <input
          id="input"
          type="text"
          value={input}
          onInput={(e) => handleOnInput(e)}
          onFocus={(_) => queryServiceStatus()}
          disabled={!apiActive}
        />
      </label>
    </form>
  );

  function handleFormSubmit(event: React.FormEvent) {
    // prevent default form submission
    event.preventDefault();

    moveToSentenceSelector();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    // console.log("key: {event.key}")

    // listen for results selection
    if (event.key === "ArrowDown") {
      event.preventDefault();

      moveToSentenceSelector();
    }
  }

  function moveToSentenceSelector() {
    // if no results found, don't move
    if (sentenceSelectorHidden) return;

    // remove highlight from text input box
    blurInputBox();

    // add keydown event listener to results selector
    addKeydownListener();

    // highlight results selector
    focusResultsSelector();
  }

  function focusResultsSelector() {
    let wheelPicker: HTMLUListElement = (document.getElementById(
      "wheelPicker"
    ) as HTMLUListElement)!;
    // wheelPicker.select();
    wheelPicker?.focus();
  }
}

export default TextInput;
