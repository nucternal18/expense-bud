import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  Image,
  View,
  DimensionValue,
} from "react-native";
import { colors } from "./styles/colors";
import { CHECKBOX_SIZE } from "./constants";
import type { CheckboxProps } from "./types";

const CheckBox = ({
  label,
  value,
  disabled,
  primaryColor,
  checkboxSize,
  checkboxStyle,
  checkboxLabelStyle,
  checkboxComponentStyles,
  checkboxComponent,
  onChange,
}: CheckboxProps) => {
  const fillColor = {
    backgroundColor: disabled
      ? "#d3d3d3"
      : value
      ? checkboxStyle?.backgroundColor ||
        checkboxComponentStyles?.backgroundColor ||
        checkboxStyle?.backgroundColor ||
        primaryColor ||
        "green"
      : "white",
    borderColor: disabled
      ? colors.disabled
      : checkboxStyle?.borderColor ||
        checkboxComponentStyles?.borderColor ||
        checkboxStyle?.borderColor ||
        styles.checkbox.borderColor,
  };

  return (
    <Pressable
      onPress={onChange ? () => onChange(!value) : null}
      style={[styles.checkboxContainer]}
      disabled={disabled}
    >
      <View
        style={[
          styles.checkbox,
          checkboxStyle || checkboxComponentStyles?.checkboxStyle || fillColor,
        ]}
      >
        {checkboxComponent || checkboxComponent || (
          <Image
            source={require("../../asset/images/check.png")}
            style={[
              {
                height:
                  (checkboxSize as DimensionValue) ||
                  (checkboxComponentStyles?.checkboxSize as DimensionValue) ||
                  (CHECKBOX_SIZE as DimensionValue),
                width:
                  (checkboxSize as DimensionValue) ||
                  (checkboxComponentStyles?.checkboxSize as DimensionValue) ||
                  (CHECKBOX_SIZE as DimensionValue),
              },
            ]}
          />
        )}
      </View>
      {label && label !== "" && (
        <Text
          style={[
            checkboxLabelStyle ||
              checkboxComponentStyles?.checkboxLabelStyle ||
              checkboxLabelStyle,
            styles.labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  checkbox: {
    padding: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 4,
    borderColor: "black",
  },
  labelStyle: { marginLeft: 10 },
});

export default CheckBox;
