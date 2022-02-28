import { selectInputBox } from "../utils/methods"

type PromptProps = {
  prompt: string;
  promptLHS: string;
  promptRHS: string;
  populatePrompt: Function;
};

function Prompt({ prompt, promptLHS, promptRHS, populatePrompt }: PromptProps) {
  return (
    <div id="promptText">
      <p>{prompt === "" ? "Prompt goes here" : prompt.replaceAll(" ", "_")}</p>

      <button type="button" onClick={(_) => copyText(prompt)}>
        Copy
      </button>
      <button type="button" onClick={(_) => copyText(promptLHS)}>
        Copy LHS
      </button>
      <button type="button" onClick={(_) => copyText(promptRHS)}>
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
    // // cleanup page
    // TODO
    // clearPage();

    // populate new prompt
    populatePrompt();

    // focus input box
    selectInputBox();
  }
}

export default Prompt;
