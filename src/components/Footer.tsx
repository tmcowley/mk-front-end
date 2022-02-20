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

function Footer({ inputDelta, input, lhsEquiv, rhsEquiv, wpm, errorRate, elapsedTime }: FooterProps) {
  return (
    <div id="footer">

      <div id="metrics">

        <h2>Typing Metrics</h2>
        <span className="boldText">WPM: </span> {wpm.toFixed(2)} w/m
        <br />
        <span className="boldText">Accuracy:</span> {(100 - errorRate).toFixed(2)}%
        <br />
        <span className="boldText">Error rate:</span> {errorRate.toFixed(2)}%
        <br />
        <span className="boldText">Elapsed time:</span> {(elapsedTime / 1000).toFixed(2)} s
      </div>

      <div id="inputStats">

        <h2>Input Stats</h2>
        <span className="boldText">Input: </span> {input}
        <br />
        <span className="boldText">Input delta:</span> {inputDelta}
        <br />
        <span className="boldText">Left-hand equivalent: </span>
        {lhsEquiv}
        <br />
        <span className="boldText">Right-hand equivalent: </span>
        {rhsEquiv}

      </div>

    </div>
  );
}

export default Footer;
