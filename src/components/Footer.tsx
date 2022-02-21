// DevStatsPanel

type FooterProps = {
  inputDelta: string;
  input: string;
  lhsEquiv: string;
  rhsEquiv: string;

  wpm: number;
  errorRate: number;
  elapsedTime: number;
};

function Footer({
  inputDelta,
  input,
  lhsEquiv,
  rhsEquiv,
  wpm,
  errorRate,
  elapsedTime,
}: FooterProps) {
  return (
    <div id="footer">
      <div id="metrics">
        <h2>Typing Metrics</h2>

        <table>
          <colgroup>
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td className="boldText">Words per minute: </td>
              <td className="monospace large leftPadding1em">
                {
                
                wpm.toFixed(2).toString().padStart(6, "0")
                
                } wm<sup>{-1}</sup>
              </td>
            </tr>
            <tr>
              <td className="boldText">Typing accuracy: </td>
              <td className="monospace large leftPadding1em">
                {
                
                (100 - errorRate).toFixed(2).toString().padStart(6, "0")
                
                } %
              </td>
            </tr>
            <tr>
              <td className="boldText">Typing error rate: </td>
              <td className="monospace large leftPadding1em">
                {
                
                errorRate.toFixed(2).toString().padStart(6, "0")
                
                } %
              </td>
            </tr>
            <tr>
              <td className="boldText">Elapsed time</td>
              <td className="monospace large leftPadding1em">
                {
                
                (elapsedTime / 1000).toFixed(2).toString().padStart(6, "0")
                
                } s
              </td>
            </tr>
          </tbody>
        </table>

        {/* <span className="boldText">WPM: </span> {wpm.toFixed(2)} w/m
        <br />
        <span className="boldText">Accuracy:</span> {(100 - errorRate).toFixed(2)}%
        <br />
        <span className="boldText">Error rate:</span> {errorRate.toFixed(2)}%
        <br />
        <span className="boldText">Elapsed time:</span> {(elapsedTime / 1000).toFixed(2)} s */}
      </div>

      <div id="inputStats">
        <h2>Input Stats</h2>

        <table>
          <colgroup>
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td className="boldText">Input</td>
              <td className="monospace large leftPadding1em">{input}</td>
            </tr>
            <tr>
              <td className="boldText">Left form</td>
              <td className="monospace large leftPadding1em">{lhsEquiv}</td>
            </tr>
            <tr>
              <td className="boldText">Right form</td>
              <td className="monospace large leftPadding1em">{rhsEquiv}</td>
            </tr>
          </tbody>
        </table>

        {/* <span className="boldText">Input: </span> {input}
        <br />
        <span className="boldText">Input delta:</span> {inputDelta}
        <br />
        <span className="boldText">Left-hand equivalent: </span>
        {lhsEquiv}
        <br />
        <span className="boldText">Right-hand equivalent: </span>
        {rhsEquiv} */}
      </div>
    </div>
  );
}

export default Footer;
