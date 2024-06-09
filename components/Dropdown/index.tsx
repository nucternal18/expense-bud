import React, { useState, useEffect, useCallback } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TextStyle,
  ViewStyle,
} from "react-native";
import Dropdown from "@/components/Dropdown/Dropdown";
import DropdownFlatList from "@/components/Dropdown/DropdownFlatlist";
import type { ListIndexProps } from "@/components/Dropdown/DropdownSectionList";
import CustomModal from "@/components/CustomModal";
import { colors } from "./styles/colors";
import { DEFAULT_OPTION_LABEL, DEFAULT_OPTION_VALUE } from "./constants";
import type {
  DropdownProps,
  TFlatList,
  TFlatListItem,
} from "./types";

/**
 * DropdownSelect component is a customizable dropdown select component in React.
 *
 * @component
 * @example
 * <DropdownSelect
 *   placeholder="Select an option"
 *   label="Dropdown"
 *   options={options}
 *   onValueChange={handleValueChange}
 *   selectedValue={selectedValue}
 *   isMultiple={false}
 *   isSearchable={true}
 * />
 *
 * @param {Object} props - The component props.
 * @param {string} props.placeholder - The placeholder text for the dropdown.
 * @param {string} props.label - The label text for the dropdown.
 * @param {string} props.error - The error message for the dropdown.
 * @param {string} props.helperText - The helper text for the dropdown.
 * @param {Array} props.options - The array of options for the dropdown.
 * @param {string} props.optionLabel - The property name for the option label.
 * @param {string} props.optionValue - The property name for the option value.
 * @param {Function} props.onValueChange - The callback function to handle value changes.
 * @param {string|number} props.selectedValue - The selected value(s) for the dropdown.
 * @param {boolean} props.isMultiple - Indicates whether multiple selections are allowed.
 * @param {boolean} props.isSearchable - Indicates whether the dropdown is searchable.
 * @param {ReactNode} props.dropdownIcon - The custom dropdown icon component.
 * @param {CSSProperties} props.labelStyle - The custom style for the label.
 * @param {CSSProperties} props.placeholderStyle - The custom style for the placeholder.
 * @param {CSSProperties} props.dropdownStyle - The custom style for the dropdown.
 * @param {CSSProperties} props.dropdownIconStyle - The custom style for the dropdown icon.
 * @param {CSSProperties} props.dropdownContainerStyle - The custom style for the dropdown container.
 * @param {CSSProperties} props.dropdownErrorStyle - The custom style for the dropdown error.
 * @param {CSSProperties} props.dropdownErrorTextStyle - The custom style for the dropdown error text.
 * @param {CSSProperties} props.dropdownHelperTextStyle - The custom style for the dropdown helper text.
 * @param {CSSProperties} props.selectedItemStyle - The custom style for the selected item.
 * @param {CSSProperties} props.multipleSelectedItemStyle - The custom style for the selected items in multiple selection mode.
 * @param {string} props.primaryColor - The primary color for the dropdown.
 * @param {boolean} props.disabled - Indicates whether the dropdown is disabled.
 * @param {number} props.checkboxSize - The size of the checkbox (kept for backwards compatibility).
 * @param {CSSProperties} props.checkboxStyle - The custom style for the checkbox (kept for backwards compatibility).
 * @param {CSSProperties} props.checkboxLabelStyle - The custom style for the checkbox label (kept for backwards compatibility).
 * @param {CSSProperties} props.checkboxComponentStyles - The custom styles for the checkbox component (kept for backwards compatibility).
 * @param {ReactNode} props.checkboxComponent - The custom checkbox component (kept for backwards compatibility).
 * @param {ReactNode} props.listHeaderComponent - The custom component for the list header.
 * @param {ReactNode} props.listFooterComponent - The custom component for the list footer.
 * @param {CSSProperties} props.listComponentStyles - The custom styles for the list component.
 * @param {boolean} props.hideModal - Indicates whether to hide the dropdown modal.
 * @param {Object} props.listControls - The controls for the list component.
 * @param {Object} props.searchControls - The controls for the search component.
 * @param {Object} props.modalControls - The controls for the modal component.
 * @param {Object} props.rest - The rest of the props.
 * @returns {JSX.Element} - The rendered DropdownSelect component.
 */
export const DropdownSelect: React.FC<DropdownProps> = ({
  placeholder,
  label,
  error,
  helperText,
  options,
  optionLabel,
  optionValue,
  onValueChange,
  selectedValue,
  dropdownIcon,
  labelStyle,
  placeholderStyle,
  dropdownStyle,
  dropdownIconStyle,
  dropdownContainerStyle,
  dropdownErrorStyle,
  dropdownErrorTextStyle,
  dropdownHelperTextStyle,
  selectedItemStyle,
  multipleSelectedItemStyle,
  primaryColor,
  disabled,
  checkboxSize, // kept for backwards compatibility
  checkboxStyle, // kept for backwards compatibility
  checkboxLabelStyle, // kept for backwards compatibility
  checkboxComponentStyles, // kept for backwards compatibility
  checkboxComponent, // kept for backwards compatibility
  listHeaderComponent,
  listFooterComponent,
  listComponentStyles,
  hideModal = false,
  listControls,
  searchControls,
  modalControls,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(""); // for single selection
  const [searchValue, setSearchValue] = useState<string>("");
  const [listIndex, setListIndex] = useState<{
    sectionIndex?: number;
    itemIndex: number;
  }>({ itemIndex: -1, sectionIndex: -1 }); // for scrollToIndex in Sectionlist and Flatlist

  useEffect(() => {
    setSelectedItem(selectedValue);

    return () => {};
  }, [selectedValue, onValueChange]);

  const optLabel = optionLabel || DEFAULT_OPTION_LABEL;
  const optValue = optionValue || DEFAULT_OPTION_VALUE;

  /*===========================================
   * Selection handlers
   *==========================================*/
  /**
   * Handles the selection of a single item in the dropdown.
   * If the selected item is already the current value, it clears the selection and sends null to the parent component.
   * If the selected item is different from the current value, it updates the selection, sends the new value to the parent component, and closes the dropdown modal.
   *
   * @param value - The value of the selected item.
   */
  const handleSingleSelection = useCallback(
    (value: string | number) => {
      setSelectedItem(value);
      onValueChange(selectedItem); // send value to parent
      setOpen(false); // close modal upon selection // send value to parent
    },
    [onValueChange, selectedItem]
  );

  /**
   * Removes disabled items from the given array of items.
   * @param items - The array of items to filter.
   * @returns The filtered array of items without disabled items.
   */
  const removeDisabledItems = (items: TFlatList) => {
    return items?.filter((item: TFlatListItem) => !item.disabled);
  };

  /*===========================================
   * Get label handler
   *==========================================*/
  /**
   * Returns the label(s) of the selected item(s) in the dropdown.
   * @returns The label(s) of the selected item(s).
   */
  const getSelectedItemsLabel = useCallback(() => {
    const selectedItemLabel = options.find(
      (item: any) => item[optValue] === selectedItem
    ) ;
    return selectedItemLabel?.[optLabel ];
  }, [options, optValue, optLabel, selectedItem]);

  /*===========================================
   * Modal
   *==========================================*/
  /**
   * Handles the toggle of the modal.
   * If the Dropdown is disabled, the function does nothing.
   * Otherwise, it toggles the open state, resets the search value,
   * sets the options to the initial options, and resets the list index.
   */
  const handleToggleModal = () => {
    if (disabled) {
      // protecting any toggleModal invocation when Dropdown is disabled by not activating state
      return;
    }
    setOpen(!open);
    setSearchValue("");
    setListIndex({ itemIndex: -1, sectionIndex: -1 });
  };

  useEffect(() => {
    if (hideModal) {
      setOpen(false);
    }
    return () => {};
  }, [hideModal]);

  let primary = primaryColor || colors.gray;

  /*===========================================
   * setIndexOfSelectedItem - For ScrollToIndex
   *==========================================*/
  /**
   * Sets the index of the selected item based on the selected label.
   * @param selectedLabel - The label of the selected item.
   */
  const setIndexOfSelectedItem = (selectedLabel: string) => {
    (options as TFlatListItem[] | undefined)?.find(
      (item: TFlatListItem, itemIndex: number) => {
        if (item[optLabel] === selectedLabel) {
          setListIndex({ itemIndex });
        }
      }
    );
  };

  return (
    <>
      <Dropdown
        label={label}
        placeholder={placeholder}
        error={error}
        getSelectedItemsLabel={getSelectedItemsLabel}
        selectedItem={selectedItem}
        handleToggleModal={handleToggleModal}
        labelStyle={labelStyle}
        dropdownIcon={dropdownIcon}
        dropdownStyle={dropdownStyle}
        dropdownIconStyle={dropdownIconStyle}
        dropdownContainerStyle={dropdownContainerStyle}
        dropdownErrorStyle={dropdownErrorStyle}
        dropdownErrorTextStyle={dropdownErrorTextStyle}
        dropdownHelperTextStyle={dropdownHelperTextStyle}
        selectedItemStyle={selectedItemStyle}
        multipleSelectedItemStyle={multipleSelectedItemStyle}
        primaryColor={primary}
        disabled={disabled}
        placeholderStyle={placeholderStyle}
        setIndexOfSelectedItem={setIndexOfSelectedItem}
        {...rest}
      />
      <CustomModal
        visible={open}
        onRequestClose={() => handleToggleModal()}
        modalControls={modalControls}
        
      >
        <DropdownFlatList
          options={options}
          optionLabel={optLabel}
          optionValue={optValue}
          selectedItem={selectedItem}
          handleSingleSelection={handleSingleSelection}
          primaryColor={primary}
          checkboxSize={checkboxSize as number}
          checkboxStyle={checkboxStyle}
          checkboxLabelStyle={checkboxLabelStyle as TextStyle}
          checkboxComponentStyles={checkboxComponentStyles as ViewStyle}
          checkboxComponent={checkboxComponent}
          listIndex={listIndex as ListIndexProps}
          emptyListMessage={listControls?.emptyListMessage as string}
        />
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  optionsContainerStyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
  },
});

export default DropdownSelect;
