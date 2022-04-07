type FooterProps = {
  loggedIn: boolean;
  prompt: string;
  inputDelta: string;
  input: string;
  inputLeft: string;
  inputRight: string;

  wpm: number;
  wpmTrue: number;
  errorRate: number;
  elapsedTime: number;
  sessionNumber: number;
  phraseNumber: number;
  phrasesPerSession: number;
};

function Footer({
    loggedIn,
  prompt,
  inputDelta,
  input,
  inputLeft,
  inputRight,
  wpm,
  wpmTrue,
  errorRate,
  elapsedTime,
    sessionNumber, phraseNumber, phrasesPerSession
}: FooterProps) {
  return (
    <div id="footer" className="flexbox-container">
      <div className="flexbox-item" id="typing-metrics">
        <h3 className="centre">Typing Metrics</h3>

        <table>
          <colgroup>
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td
              // className="boldText"
              >
                Elapsed time:{" "}
              </td>
              <td className="monospace large leftPadding1em">
                {(elapsedTime / 1000).toFixed(2).toString().padStart(6, "0")} s
              </td>
            </tr>

            {/* <hr /> */}

            <tr>
              <td
              // className="boldText"
              >
                Accuracy:{" "}
              </td>
              <td className="monospace large leftPadding1em">
                {(100 - errorRate).toFixed(2).toString().padStart(6, "0")} %
              </td>
            </tr>

            {/* <tr>
              <td
              // className="boldText"
              >
                Speed (typing):{" "}
              </td>
              <td className="monospace large leftPadding1em">
                {wpm.toFixed(2).toString().padStart(6, "0")} wm
                <sup>{-1}</sup>
              </td>
            </tr> */}

            <tr>
              <td
              // className="boldText"
              >
                Speed:{" "}
              </td>
              <td className="monospace large leftPadding1em">
                {wpmTrue.toFixed(2).toString().padStart(6, "0")} wm
                <sup>{-1}</sup>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
          id="input-stats"
          className="flexbox-item"
          hidden={!loggedIn}
      >
        <h3 className="centre">Training Stats</h3>
        <div className="centre">
          Session {sessionNumber}, Phrase {phraseNumber} of {phrasesPerSession}
        </div>
      </div>

      <div
        // id="inputStats"
        id="input-stats"
        className="flexbox-item"
        // className="metricsItem"
      >
        <h3 className="centre">Input Stats</h3>

        <table>
          <colgroup>
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td>Prompt: </td>
              <td className="monospace large leftPadding1em">{prompt}</td>
            </tr>

            {/* <hr /> */}

            <tr>
              <td
              // className="boldText"
              >
                Input:{" "}
              </td>
              <td className="monospace large leftPadding1em">{input}</td>
            </tr>
            <tr>
              <td
              // className="boldText"
              >
                Left form:{" "}
              </td>
              <td className="monospace large leftPadding1em">{inputLeft}</td>
            </tr>
            <tr>
              <td
              // className="boldText"
              >
                Right form:{" "}
              </td>
              <td className="monospace large leftPadding1em">{inputRight}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Footer;
