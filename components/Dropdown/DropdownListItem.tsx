import React, { memo } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TextProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import type { CheckboxProps } from "./types";
import { ThemedText } from "../ThemedText";

type DropdownListItemProps = {
  item: any;
  optionLabel: string;
  optionValue: string;
  selectedOption: any;
  onChange: (value: any) => void;
  primaryColor: string;
  checkboxSize: number;
  checkboxStyle: CheckboxProps["checkboxStyle"];
  checkboxLabelStyle: TextStyle;
  checkboxComponentStyles: CheckboxProps["checkboxComponentStyles"];
  checkboxComponent: CheckboxProps["checkboxComponent"];
};

const DropdownListItem = ({
  item,
  optionLabel,
  optionValue,
  onChange,
  primaryColor,
  checkboxSize,
  checkboxStyle,
  checkboxLabelStyle,
  checkboxComponentStyles,
  checkboxComponent,
}: DropdownListItemProps) => {

  return (
    <TouchableOpacity
      style={styles.listItemContainerStyle}
      onPress={
        () => onChange(item[optionValue]) // intentionally didn't use the disable property
      }
    >
      {optionLabel && optionLabel !== "" && (
        <ThemedText
          style={[
            checkboxLabelStyle ||
              checkboxComponentStyles?.checkboxLabelStyle ||
              checkboxLabelStyle,
            styles.labelStyle,
          ]}
        >
          {item[optionValue]}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItemContainerStyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  labelStyle: { marginLeft: 10 },
});

export default memo(DropdownListItem);
