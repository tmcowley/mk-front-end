type FooterProps = {
  prompt: string;
  inputDelta: string;
  input: string;
  lhsEquiv: string;
  rhsEquiv: string;

  wpm: number;
  wpmTrue: number;
  errorRate: number;
  elapsedTime: number;
};

function Footer({
  prompt,
  inputDelta,
  input,
  lhsEquiv,
  rhsEquiv,
  wpm,
  wpmTrue,
  errorRate,
  elapsedTime,
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

            <tr>
              <td
              // className="boldText"
              >
                Speed (typing):{" "}
              </td>
              <td className="monospace large leftPadding1em">
                {wpm.toFixed(2).toString().padStart(6, "0")} wm
                <sup>{-1}</sup>
              </td>
            </tr>

            <tr>
              <td
              // className="boldText"
              >
                Speed (full):{" "}
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
              <td className="monospace large leftPadding1em">{lhsEquiv}</td>
            </tr>
            <tr>
              <td
              // className="boldText"
              >
                Right form:{" "}
              </td>
              <td className="monospace large leftPadding1em">{rhsEquiv}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Footer;
