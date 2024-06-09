import type {
  ViewStyle,
  ColorValue,
  TextStyle,
  ModalProps,
  TextInputProps,
  SectionList,
} from "react-native";

export type DropdownProps = CommonDropdownProps &
  TDropdownInputProps &
  TSearchControls &
  TCheckboxControls &
  TCustomModalControls &
  TListControls & CheckboxProps

export type CommonDropdownProps = {
  label?: string;
  options: TFlatList | TSectionList;
  optionLabel?: string;
  optionValue?: string;
  onValueChange: Function;
  selectedValue?:
    | string
    | boolean
    | number
    | string[]
    | boolean[]
    | number[]
    | null;
};

export type TDropdownInputProps = {
  placeholder?: string;
  error?: string;
  helperText?: string;
  isMultiple?: boolean;
  isSearchable?: boolean;
  dropdownIcon?: React.ReactNode;
  labelStyle?: TextStyle;
  dropdownStyle?: ViewStyle;
  dropdownIconStyle?: ViewStyle;
  dropdownContainerStyle?: ViewStyle;
  dropdownErrorStyle?: ViewStyle;
  dropdownErrorTextStyle?: TextStyle;
  dropdownHelperTextStyle?: TextStyle;
  selectedItemStyle?: TextStyle;
  multipleSelectedItemStyle?: TextStyle;
  primaryColor?: ColorValue;
  disabled?: boolean;
  placeholderStyle?: TextStyle;
  hideModal?: boolean;
};

export type TSearchControls = {
  // /** @deprecated Use `searchControls = {{textInputStyle: ViewStyle | TextStyle }}` instead.*/
  // searchInputStyle?: ViewStyle;
  searchControls?: {
    textInputStyle?: ViewStyle | TextStyle;
    textInputContainerStyle?: ViewStyle;
    textInputProps?: TextInputProps;
  };
};
export type TCheckboxControls = {
  // /** @deprecated Use `checkboxControls = {{checkboxSize: number }}` instead.*/
  // checkboxSize?: number;
  // /** @deprecated Use `checkboxControls = {{checkboxStyle: ViewStyle }}` instead.*/
  // checkboxStyle?: ViewStyle;
  // /** @deprecated Use `checkboxControls = {{checkboxLabelStyle: TextStyle }}` instead.*/
  // checkboxLabelStyle?: TextStyle;
  // /** @deprecated Use `checkboxControls` instead.*/
  // checkboxComponentStyles?: {
  //   checkboxSize?: number;
  //   checkboxStyle?: ViewStyle;
  //   checkboxLabelStyle?: TextStyle;
  // };
  // /** @deprecated Use `checkboxControls = {{checkboxComponent: <View></View> }}` instead.*/
  // checkboxComponent?: React.ReactNode;

  checkboxSize?: number;
  checkboxStyle?: ViewStyle;
  checkboxLabelStyle?: TextStyle;
  checkboxComponent?: React.ReactNode;
};

export type TCustomModalControls = {
  // /** @deprecated Use `modalControls = {{modalBackgroundStyle: ViewStyle}} instead.*/
  // modalBackgroundStyle?: ViewStyle;
  // /** @deprecated Use `modalControls = {{ modalOptionsContainerStyle: ViewStyle}} instead.*/
  // modalOptionsContainerStyle?: ViewStyle;
  // /** @deprecated Use `modalControls = {{modalProps: ModalProps }}` instead.*/
  // modalProps?: ModalProps;
  modalControls?: {
    modalBackgroundStyle?: ViewStyle;
    modalOptionsContainerStyle?: ViewStyle;
    modalProps?: ModalProps;
  };
};

export type TListControls = {
  listHeaderComponent?: React.ComponentProps<typeof SectionList>["ListHeaderComponent"];
  listFooterComponent?: React.ComponentProps<typeof SectionList>["ListFooterComponent"];
  listComponentStyles?: {
    listEmptyComponentStyle?: TextStyle;
    itemSeparatorStyle?: ViewStyle;
    sectionHeaderStyle?: TextStyle;
  };
  listControls?: {
    selectAllText?: string;
    unselectAllText?: string;
    selectAllCallback?: () => void;
    unselectAllCallback?: () => void;
    hideSelectAll?: boolean;
    emptyListMessage?: string;
  };
};

export type TFlatList = TFlatListItem[];
export type TFlatListItem = {
  [key: string]: string | number | boolean;
};

export type TSectionList = TSectionListItem[];
export type TSectionListItem = { title: string; data: TFlatList };

export type CheckboxProps = {
  label?: string;
  value?: boolean;
  disabled?: boolean;
  primaryColor?: ColorValue;
  onChange?: (value: boolean | string | number) => void;
  checkboxComponentStyles?: ViewStyle & TCheckboxControls;
} & TCheckboxControls;
