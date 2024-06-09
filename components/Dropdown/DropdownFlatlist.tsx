/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from "react";
import { FlatList, StyleSheet } from "react-native";
import DropdownListItem from "./DropdownListItem";
import {
  ItemSeparatorComponent,
  ListEmptyComponent,
} from "./AuxiliaryComponents";
import { TFlatList } from "./types";
import { TDropdownSectionList } from "./DropdownSectionList";

const DropdownFlatList = ({
  options,
  optionLabel,
  optionValue,
  selectedItems,
  selectedItem,
  handleSingleSelection,
  primaryColor,
  checkboxSize, // kept for backwards compatibility to be removed in future release
  checkboxStyle, // kept for backwards compatibility to be removed in future release
  checkboxLabelStyle, // kept for backwards compatibility to be removed  in future release
  checkboxComponentStyles,
  checkboxComponent,
  checkboxControls,
  listComponentStyles,
  listIndex,
  emptyListMessage,
  ...rest
}: any) => {


  return (
    <FlatList
      data={options}
      initialNumToRender={5}
      ListEmptyComponent={
        <ListEmptyComponent
          listEmptyComponentStyle={listComponentStyles?.listEmptyComponentStyle}
          emptyListMessage={emptyListMessage}
        />
      }
      contentContainerStyle={[
         styles.contentContainerStyle,
      ]}
      ItemSeparatorComponent={() => (
        <ItemSeparatorComponent
          itemSeparatorStyle={listComponentStyles?.itemSeparatorStyle}
        />
      )}
      renderItem={(item) =>{
        return _renderItem(item, {
          optionLabel,
          optionValue,
          selectedOption: selectedItem,
          onChange: handleSingleSelection,
          primaryColor,
          checkboxSize, // kept for backwards compatibility
          checkboxStyle, // kept for backwards compatibility
          checkboxLabelStyle, // kept for backwards compatibility
          checkboxComponentStyles, // kept for backwards compatibility
          checkboxComponent, // kept for backwards compatibility
        })}
      }
      keyExtractor={(_item, index) => `Options${index}`}
      gap={5}
      {...rest}
    />
  );
};

const _renderItem = (
  { item }: any,
  props: Omit<
    TDropdownSectionList,
    | "options"
    | "isSearchable"
    | "selectedItems"
    | "selectedItem"
    | "listIndex"
    | "listComponentStyles"
    | "emptyListMessage"
    | " handleMultipleSelections"
    | "handleMultipleSelections"
    | "handleSingleSelection"
    | "checkboxControls"
  > & {
    selectedOption: any;
    onChange: (value: any) => void;
  }
) => {
  return (
    <DropdownListItem
      item={item}
      optionLabel={props.optionLabel}
      optionValue={props.optionValue}
      selectedOption={props.selectedOption}
      onChange={props.onChange}
      primaryColor={props.primaryColor}
      checkboxSize={props.checkboxSize}
      checkboxStyle={props.checkboxStyle}
      checkboxLabelStyle={props.checkboxLabelStyle}
      checkboxComponentStyles={props.checkboxComponentStyles}
      checkboxComponent={props.checkboxComponent}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: { paddingVertical: 10 },
});

export default DropdownFlatList;
