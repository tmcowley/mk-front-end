// abandoned due to issue with changing App state

// import { createRef } from "react";

// see: https://www.npmjs.com/package/react-simple-wheel-picker
import WheelPicker, {
  PickerData,
  // WheelPickerRef,
} from "react-simple-wheel-picker";

// import { selectInputBox } from "../utils/methods";

type SentenceSelectorProps = {
  results: string[],
  onChange: (target: PickerData) => void
};

function SentenceSelector({
  results,
  onChange,
}: SentenceSelectorProps) {

  // convert results array to picker data
  let data: PickerData[] = [];
  results.forEach((sentence, index) => {
    const line: PickerData = {
      id: index.toString(),
      // format: "index - sentence"
      value: (index + 1).toString() + " - " + sentence,
    };
    data.push(line);
  });

  const noResults = data.length === 0
  if (noResults) {
    data.push({
      id: "0", 
      value: "Enter above to populate results"
    })
  }

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
        selectedID={data[0]?.id}
        color="#ccc"
        activeColor="#333"
        backgroundColor="#fff"
        shadowColor="white"
        idName="wheelPicker"
        // ref={(pickerRef) => {}}
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
