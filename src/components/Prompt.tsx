import { selectInputBox } from "../utils/methods"

type PromptProps = {
  loggedIn: boolean;
  prompt: string;
  promptLeft: string;
  promptRight: string;
  populatePrompt: Function;
  clearPage: Function;
};

function Prompt({ loggedIn, prompt, promptLeft, promptRight, populatePrompt, clearPage }: PromptProps) {

  return (
    <div id="promptText">
      {/* "␣", "_", prompt.replaceAll(" ", "_") */}
      <p>{prompt === "" ? "Prompt goes here" : prompt}</p>

      <button type="button" onClick={(_) => copyText(prompt)}>
        Copy
      </button>
      <button type="button" onClick={(_) => copyText(promptLeft)}>
        Copy LHS
      </button>
      <button type="button" onClick={(_) => copyText(promptRight)}>
        Copy RHS
      </button>
      <button type="button" onClick={(_) => skipPrompt()}>
        Skip
      </button>
    </div>
  );

  function copyText(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );

    // focus input box
    selectInputBox();
  }

  function skipPrompt() {
    // cleanup page
    clearPage();

    // populate new prompt
    populatePrompt(loggedIn);

    // focus input box
    selectInputBox();
  }
}

export default Prompt;
