// abandoned due to issue with changing App state

// import { createRef } from "react";

// see: https://www.npmjs.com/package/react-simple-wheel-picker
import WheelPicker, {
  PickerData,
  // WheelPickerRef,
} from "react-simple-wheel-picker";

// import { selectInputBox } from "../utils/methods";

type SentenceSelectorProps = {
  results: string[] | undefined;
  computed: boolean;
  onChange: (target: PickerData) => void;
};

function SentenceSelector({
  results,
  computed,
  onChange,
}: SentenceSelectorProps) {
  if (results === [] || !results || results.length === 0 || !computed) {
    return <></>;
  }

  // convert results array to picker data
  const data: Array<PickerData> = [];
  results.forEach((sentence, index) => {
    const line: PickerData = {
      id: index.toString(),
      // format: "index - sentence"
      value: (index + 1).toString() + " - " + sentence,
    };
    data.push(line);
  });

  // const ref: WheelPickerRef = {focus: onFocus, blur: onBlur};
  // const reactRef: React.Ref<WheelPickerRef> = createRef<WheelPickerRef>();

  return (
    <div
      id="sentenceSelector"
      className="monospace borderless"
      // using hidden attrib breaks program
      // hidden={input === ""}
    >
      <WheelPicker
        data={data}
        onChange={onChange}
        height={300}
        // width={windowDimensions.width * 0.8}
        titleText="results wheel picker"
        itemHeight={30}
        selectedID={data[0].id}
        color="#ccc"
        activeColor="#333"
        backgroundColor="#fff"
        shadowColor="white"
        idName="wheelPicker"
        // ref={reactRef}
      />
    </div>
  );

  // function onFocus() {
  //   return;
  // }

  // function onBlur() {
  //   selectInputBox();
  // }
}

export default SentenceSelector;
