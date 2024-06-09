import React, { memo } from "react";
import { TouchableOpacity, StyleSheet, TextProps, ViewStyle, TextStyle } from "react-native";
import CheckBox from "./Checkbox";
import type { CheckboxProps } from "./types";

type DropdownListItemProps = {
  item: any;
  optionLabel: string;
  optionValue: string;
  isMultiple: boolean;
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
  isMultiple,
  selectedOption,
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
        item.disabled ? () => {} : () => onChange(item[optionValue]) // intentionally didn't use the disable property
      }
    >
      <CheckBox
        value={
          isMultiple
            ? selectedOption.includes(item[optionValue])
            : [selectedOption].includes(item[optionValue])
        }
        label={item[optionLabel]}
        onChange={() => onChange(item[optionValue])}
        primaryColor={primaryColor}
        checkboxSize={checkboxComponentStyles?.checkboxSize || checkboxSize}
        checkboxStyle={checkboxComponentStyles?.checkboxStyle || checkboxStyle}
        checkboxLabelStyle={
          checkboxComponentStyles?.checkboxLabelStyle || checkboxLabelStyle
        }
        disabled={item.disabled}
        checkboxComponent={checkboxComponent}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItemContainerStyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default memo(DropdownListItem);
