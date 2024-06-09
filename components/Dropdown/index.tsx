import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity, StyleSheet, View, TextStyle, ViewStyle } from "react-native";
import Input from "@/components/Input";
import CheckBox from "@/components/Dropdown/Checkbox";
import Dropdown from "@/components/Dropdown/Dropdown";
import DropdownFlatList from "@/components/Dropdown/DropdownFlatlist";
import DropdownSectionList, { ListComponentStylesProps, ListIndexProps } from "@/components/Dropdown/DropdownSectionList";
import CustomModal from "@/components/CustomModal";
import { colors } from "./styles/colors";
import { DEFAULT_OPTION_LABEL, DEFAULT_OPTION_VALUE } from "./constants";
import type {
  DropdownProps,
  TFlatList,
  TFlatListItem,
  TSectionList,
  TSectionListItem,
} from "./types";
import { escapeRegExp, extractPropertyFromArray } from "@/utils";

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
  isMultiple,
  isSearchable,
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
  const [newOptions, setNewOptions] = useState<TFlatList | TSectionList>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(""); // for single selection
  const [selectedItems, setSelectedItems] = useState<any[]>([]); // for multiple selection
  const [searchValue, setSearchValue] = useState<string>("");
  const [listIndex, setListIndex] = useState<{
    sectionIndex?: number;
    itemIndex: number;
  }>({ itemIndex: -1, sectionIndex: -1 }); // for scrollToIndex in Sectionlist and Flatlist

  useEffect(() => {
    setNewOptions(options);
    return () => {};
  }, [options]);

  useEffect(() => {
    isMultiple
      ? setSelectedItems(Array.isArray(selectedValue) ? selectedValue : [])
      : setSelectedItem(selectedValue);

    return () => {};
  }, [selectedValue, isMultiple, onValueChange]);

  /*===========================================
   * List type
   *==========================================*/

  // check the structure of the new options array to determine if it is a section list or a
  const isSectionList = newOptions?.some(
    (item) => item.title && item.data && Array.isArray(item.data)
  );

/**
 * Determines the type of list component to use based on the value of `isSectionList`.
 *
 * @param {boolean} isSectionList - Indicates whether the list should be a section list or a flat list.
 * @returns {React.ComponentType} - The appropriate list component based on the value of `isSectionList`.
 */
const ListTypeComponent = isSectionList
    ? DropdownSectionList
    : DropdownFlatList;

/**
 * Extracts the "data" property from an array of objects and flattens the result.
 *
 * @param options - The array of objects to extract the "data" property from.
 * @returns The flattened array of "data" values, or undefined if the "data" property is not found.
 */
const modifiedSectionData = extractPropertyFromArray(
    newOptions,
    "data"
)?.flat();

  /**
   * `options` is the original array, it never changes. (Do not use except you really need the original array) .
   * `newOptions` is a copy of options but can be mutated by `setNewOptions`, as a result, the value many change.
   * `modifiedOptions` should only be used for computations. It has the same structure for both `FlatList` and `SectionList`
   */

  
/**
 * Modifies the options based on whether it is a section list or not.
 * If it is a section list, it uses the modified section data.
 * If it is not a section list, it uses the new options.
 *
 * @param {boolean} isSectionList - Indicates whether the options are a section list.
 * @param {Array} modifiedSectionData - The modified section data.
 * @param {Array} newOptions - The new options.
 * @returns {Array} - The modified options.
 */
const modifiedOptions = isSectionList ? modifiedSectionData : newOptions;

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
const handleSingleSelection = (value: string | number) => {
    if (selectedItem === value) {
        setSelectedItem(null);
        onValueChange(null); // send value to parent
    } else {
        setSelectedItem(value);
        onValueChange(value); // send value to parent
        setOpen(false); // close modal upon selection
    }
};

/**
 * Handles multiple selections in the dropdown component.
 * @param value - The selected value(s) to be handled.
 */
const handleMultipleSelections = (value: string[] | number[]) => {
    setSelectedItems((prevVal) => {
        let selectedValues = [...prevVal];

        if (selectedValues?.includes(value)) {
            selectedValues = selectedValues.filter((item) => item !== value);
        } else {
            selectedValues.push(value);
        }
        onValueChange(selectedValues); // send value to parent
        return selectedValues;
    });
};

/**
 * Removes disabled items from the given array of items.
 * @param items - The array of items to filter.
 * @returns The filtered array of items without disabled items.
 */
const removeDisabledItems = (items: TFlatList) => {
    return items?.filter((item: TFlatListItem) => !item.disabled);
};

/**
 * Handles the select all functionality in the dropdown component.
 */
const handleSelectAll = () => {
    setSelectAll((prevVal) => {
        const selectedValues = [];

        // don't select disabled items
        const filteredOptions = removeDisabledItems(
            isSectionList
                ? extractPropertyFromArray(options, "data").flat()
                : options
        );

        if (!prevVal) {
            for (let i = 0; i < filteredOptions.length; i++) {
                selectedValues.push(filteredOptions[i][optValue]);
            }
        }

        setSelectedItems(selectedValues);
        onValueChange(selectedValues); // send value to parent
        return !prevVal;
    });

    if (typeof listControls?.selectAllCallback === "function" && !selectAll) {
        listControls.selectAllCallback();
    }

    if (typeof listControls?.unselectAllCallback === "function" && selectAll) {
        listControls.unselectAllCallback();
    }
};

  /*===========================================
   * Handle side effects
   *==========================================*/
/**
 * Checks if all values in the list are selected and updates the state of the "selectAll" flag accordingly.
 * If the list contains disabled values, those values will not be selected.
 * @param selectedValues - An array of selected values.
 */
const checkSelectAll = useCallback(
    (selectedValues: any[]) => {
        if (
            removeDisabledItems(modifiedOptions)?.length === selectedValues?.length
        ) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    },
    [modifiedOptions]
);

  // anytime the selected items change, check if it is time to set `selectAll` to true
  useEffect(() => {
    if (isMultiple) {
      checkSelectAll(selectedItems);
    }
    return () => {};
  }, [checkSelectAll, isMultiple, selectedItems]);

  /*===========================================
   * Get label handler
   *==========================================*/
/**
 * Returns the label(s) of the selected item(s) in the dropdown.
 * @returns The label(s) of the selected item(s).
 */
const getSelectedItemsLabel = () => {
    if (isMultiple && Array.isArray(selectedItems)) {
        let selectedLabels: Array<string> = [];

        selectedItems?.forEach((element: number | string) => {
            let selectedItemLabel = modifiedOptions?.find(
                (item: TFlatListItem) => item[optValue] === element
            )?.[optLabel];
            selectedLabels.push(selectedItemLabel);
        });
        return selectedLabels;
    }

    let selectedItemLabel = modifiedOptions?.find(
        (item: TFlatListItem) => item[optValue] === selectedItem
    );
    return selectedItemLabel?.[optLabel];
};

  /*===========================================
   * Search
   *==========================================*/
/**
 * Handles the search functionality for the dropdown component.
 * @param value - The search value entered by the user.
 */
const onSearch = (value: string) => {
    setSearchValue(value);

    let searchText = escapeRegExp(value).toString().toLocaleLowerCase().trim();

    const regexFilter = new RegExp(searchText, "i");

    // Because the options array will be mutated while searching, we have to search with the original array
    const searchResults = isSectionList
        ? searchSectionList(options as TSectionList, regexFilter)
        : searchFlatList(options as TFlatList, regexFilter);

    setNewOptions(searchResults);
};

/**
 * Searches a flat list of items based on a regular expression filter.
 * @param flatList - The flat list of items to search.
 * @param regexFilter - The regular expression filter to apply.
 * @returns An array of search results that match the filter.
 */
const searchFlatList = (flatList: TFlatList, regexFilter: RegExp) => {
    const searchResults = flatList.filter((item: TFlatListItem) => {
        if (
            item[optLabel].toString().toLowerCase().search(regexFilter) !== -1 ||
            item[optValue].toString().toLowerCase().search(regexFilter) !== -1
        ) {
            return true;
        }
        return false;
    });
    return searchResults;
};

/**
 * Searches a section list and filters the data based on a regular expression.
 * @param sectionList - The section list to search.
 * @param regexFilter - The regular expression used for filtering.
 * @returns The search results with filtered data.
 */
const searchSectionList = (
    sectionList: TSectionList,
    regexFilter: RegExp
) => {
    const searchResults = sectionList.map((listItem: TSectionListItem) => {
        const filteredData = listItem.data.filter((item: TFlatListItem) => {
            if (
                item[optLabel].toString().toLowerCase().search(regexFilter) !== -1 ||
                item[optValue].toString().toLowerCase().search(regexFilter) !== -1
            ) {
                return true;
            }
            return false;
        });

        return { ...listItem, data: filteredData };
    });

    return searchResults;
};

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
    setNewOptions(options);
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
    isSectionList
        ? (options as TSectionListItem[] | undefined)?.map(
                (item: TSectionListItem, sectionIndex: number) => {
                    item?.data?.find((dataItem: TFlatListItem, itemIndex: number) => {
                        if (dataItem[optLabel] === selectedLabel) {
                            setListIndex({ sectionIndex, itemIndex });
                        }
                    });
                }
            )
        : (options as TFlatListItem[] | undefined)?.find(
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
        helperText={helperText}
        error={error}
        getSelectedItemsLabel={getSelectedItemsLabel}
        selectedItem={selectedItem}
        selectedItems={selectedItems}
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
        isMultiple={isMultiple}
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
        <ListTypeComponent
          listHeaderComponent={
            <>
              {isSearchable && (
                <Input
                  value={searchValue}
                  onChangeText={(text: string) => onSearch(text)}
                  style={searchControls?.textInputStyle}
                  primaryColor={primary}
                  textInputContainerStyle={
                    searchControls?.textInputContainerStyle
                  }
                  placeholder={
                    searchControls?.textInputProps?.placeholder || "Search"
                  }
                  {...searchControls?.textInputProps}
                />
              )}
              {listHeaderComponent}
              {!listControls?.hideSelectAll &&
                isMultiple &&
                modifiedOptions?.length > 1 && (
                  <View style={styles.optionsContainerStyle}>
                    <TouchableOpacity onPress={() => {}}>
                      <CheckBox
                        value={selectAll}
                        label={
                          selectAll
                            ? listControls?.unselectAllText || "Clear all"
                            : listControls?.selectAllText || "Select all"
                        }
                        onChange={() => handleSelectAll()}
                        primaryColor={primary}
                        checkboxSize={checkboxSize}
                        checkboxStyle={checkboxStyle}
                        checkboxLabelStyle={checkboxLabelStyle}
                        checkboxComponentStyles={checkboxComponentStyles}
                        checkboxComponent={checkboxComponent}
                      />
                    </TouchableOpacity>
                  </View>
                )}
            </>
          }
          listFooterComponent={listFooterComponent}
          listComponentStyles={listComponentStyles as ListComponentStylesProps}
          options={newOptions}
          optionLabel={optLabel}
          optionValue={optValue}
          isMultiple={isMultiple as boolean}
          isSearchable={isSearchable as boolean}
          selectedItems={selectedItems}
          selectedItem={selectedItem}
          handleMultipleSelections={handleMultipleSelections}
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
