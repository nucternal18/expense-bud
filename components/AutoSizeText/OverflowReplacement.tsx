import * as React from "react";
import { NativeSyntheticEvent, Text, TextLayoutEventData } from "react-native";

import { AutoSizeTextProps } from "./types";

const OverflowReplacement = (props: AutoSizeTextProps) => {
  const {
    fontSize,
    children,
    style,
    numberOfLines,
    overflowReplacement,
    ...rest
  } = props;
  const [currentText, setCurrentText] = React.useState<string>("");

  const handleResizing = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    if (lines.length > (numberOfLines as number)) {
      setCurrentText(overflowReplacement as string);
      return;
    }

    setCurrentText(currentText);
  };

  return (
    <Text
      testID="overflow-replacement"
      style={[
        style,
        {
          fontSize: fontSize,
        },
      ]}
      {...rest}
      onTextLayout={handleResizing}
    >
      {currentText ? currentText : children}
    </Text>
  );
};

export default OverflowReplacement;
