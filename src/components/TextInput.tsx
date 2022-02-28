import {blurInputBox} from "../utils/methods";

type TextInputProps = {
    input: string
    apiActive: boolean
    handleOnInput: Function
    queryAPIStatus: Function
    addKeydownListener: Function
}

function TextInput({
    input,
    apiActive,
    handleOnInput, 
    queryAPIStatus, 
    addKeydownListener
}: TextInputProps) {
  return (
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
  );

  function handleFormSubmit(event: React.FormEvent) {
    // prevent default form submission
    event.preventDefault();

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
