import React, { useState } from "react";
import { TextInput, StyleSheet, View, Platform, ViewStyle } from "react-native";
import { inputStyles } from "./Dropdown/styles/input";

type InputProps = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    style?: React.ComponentProps<typeof TextInput>["style"];
    primaryColor: string;
    textInputContainerStyle?: ViewStyle;
    rest?: React.ComponentProps<typeof TextInput>;
};

export const Input = ({
  placeholder,
  value,
  onChangeText,
  style,
  primaryColor,
  textInputContainerStyle,
  ...rest
}: InputProps) => {
  const [isFocused, setFocus] = useState(false);

  return (
    <View style={[styles.container, textInputContainerStyle]}>
      <TextInput
        placeholder={placeholder}
        style={[
          inputStyles.input,
          Platform.select({
            web: {
              outlineColor: primaryColor,
            },
          }),
          isFocused && { borderColor: primaryColor },
          style,
        ]}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => setFocus(false)}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 23 },
});

export default Input;
