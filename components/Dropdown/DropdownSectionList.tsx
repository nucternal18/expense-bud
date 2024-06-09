/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from "react";
import { SectionList, StyleSheet, TextStyle, ViewStyle } from "react-native";
import DropdownListItem from "./DropdownListItem";
import {
  ItemSeparatorComponent,
  ListEmptyComponent,
  SectionHeaderTitle,
} from "./AuxiliaryComponents";
import { extractPropertyFromArray } from "@/utils";
import type { CheckboxProps, TCheckboxControls, TSectionList } from "./types";

export type ListComponentStylesProps = {
  listEmptyComponentStyle: TextStyle;
  itemSeparatorStyle: ViewStyle;
  listItemContainerStyle: ViewStyle;
  sectionHeaderStyle: TextStyle;
};

export type ListIndexProps = {
  sectionIndex: number;
  itemIndex: number;
};

export type TDropdownSectionList = {
  options: any[];
  optionLabel: string;
  optionValue: string;
  isMultiple: boolean;
  isSearchable: boolean;
  selectedItems: any[];
  selectedItem: any;
  handleMultipleSelections: (value: any) => void;
  handleSingleSelection: (value: any) => void;
  primaryColor: string;
  checkboxSize: number;
  checkboxStyle: CheckboxProps["checkboxStyle"];
  checkboxLabelStyle: TextStyle;
  checkboxComponentStyles: ViewStyle;
  checkboxComponent: CheckboxProps["checkboxComponent"];
  checkboxControls?: TCheckboxControls;
  listComponentStyles: ListComponentStylesProps;
  listIndex: ListIndexProps;
  emptyListMessage: string;
  listHeaderComponent?: React.ComponentProps<
    typeof SectionList
  >["ListHeaderComponent"];
  listFooterComponent?: React.ComponentProps<typeof SectionList>["ListFooterComponent"];
  rest?: React.ComponentProps<typeof SectionList>;
};

const DropdownSectionList = ({
  options,
  optionLabel,
  optionValue,
  isMultiple,
  isSearchable,
  selectedItems,
  selectedItem,
  handleMultipleSelections,
  handleSingleSelection,
  primaryColor,
  checkboxSize,
  checkboxStyle,
  checkboxLabelStyle,
  checkboxComponentStyles,
  checkboxComponent,
  checkboxControls,
  listComponentStyles,
  listIndex,
  emptyListMessage,
  listHeaderComponent,
  listFooterComponent,
  ...rest
}: TDropdownSectionList) => {
  const [expandedSections, setExpandedSections] = useState<Set<any>>(new Set());

  /**
   * Expand all sections
   */
  useEffect(() => {
    let initialState = new Set(extractPropertyFromArray(options, "title"));
    setExpandedSections(initialState);
  }, [options]);

  /**
   * @param title
   */
  const handleToggleListExpansion = (title: string) => {
    setExpandedSections((expandedSectionsState) => {
      // Using Set here but you can use an array too
      const next = new Set(expandedSectionsState);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  /**
   * @description Scroll to item location
   */

  const sectionlistRef = useRef<SectionList<TSectionList>>(null);

  const scrollToLocation = (listIndex: any) => {
    sectionlistRef?.current?.scrollToLocation({
      sectionIndex: listIndex.sectionIndex,
      animated: true,
      itemIndex: listIndex.itemIndex,
    });
  };

  useEffect(() => {
    if (listIndex.itemIndex >= 0 && listIndex.sectionIndex >= 0) {
      scrollToLocation(listIndex);
    }
  }, [listIndex]);

  return (
    <SectionList
      sections={options}
      extraData={isMultiple ? selectedItems : selectedItem}
      initialNumToRender={5}
      ListHeaderComponent={listHeaderComponent}
      ListFooterComponent={listFooterComponent}
      ListEmptyComponent={
        <ListEmptyComponent
          listEmptyComponentStyle={listComponentStyles?.listEmptyComponentStyle}
          emptyListMessage={emptyListMessage}
        />
      }
      contentContainerStyle={[
        isSearchable ? { paddingTop: 0 } : styles.contentContainerStyle,
      ]}
      ItemSeparatorComponent={() => (
        <ItemSeparatorComponent
          itemSeparatorStyle={listComponentStyles?.itemSeparatorStyle}
        />
      )}
      renderItem={(item) =>
        _renderItem(item, {
          optionLabel,
          optionValue,
          isMultiple,
          selectedOption: isMultiple ? selectedItems : selectedItem,
          onChange: isMultiple
            ? handleMultipleSelections
            : handleSingleSelection,
          primaryColor,
          checkboxSize, // kept for backwards compatibility
          checkboxStyle, // kept for backwards compatibility
          checkboxLabelStyle, // kept for backwards compatibility
          checkboxComponentStyles, // kept for backwards compatibility
          checkboxComponent, // kept for backwards compatibility
          expandedSections,
        })
      }
      renderSectionHeader={({ section: { title } }) => (
        <SectionHeaderTitle
          title={title}
          sectionHeaderStyle={listComponentStyles?.sectionHeaderStyle}
          onPress={() => handleToggleListExpansion(title)}
          isExpanded={expandedSections.has(title)}
        />
      )}
      keyExtractor={(_item, index) => `Options${index}`}
      stickySectionHeadersEnabled={false}
      ref={sectionlistRef}
      onScrollToIndexFailed={() => {
        setTimeout(() => {
          scrollToLocation(listIndex);
        }, 500);
      }}
      {...rest}
    />
  );
};

const _renderItem = (
  { section: { title }, item }: any,
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
    | "rest"
  > & {
    expandedSections: Set<any>;
    selectedOption: any;
    onChange: (value: any) => void;
  }
) => {
  const isExpanded = props?.expandedSections.has(title);

  //return null if it is not expanded
  if (!isExpanded) return null;

  return (
    <DropdownListItem
      item={item}
      optionLabel={props.optionLabel}
      optionValue={props.optionValue}
      isMultiple={props.isMultiple}
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
  contentContainerStyle: { paddingTop: 20 },
});

export default DropdownSectionList;
