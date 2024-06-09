import React, { ReactElement } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  ModalProps,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { colors } from "./Dropdown/styles/colors";
import { TCustomModalControls } from "./Dropdown/types";

type ScreenWrapperProps = {
  children: React.ReactNode;
};

// In iOS, `SafeAreaView` does not automatically account on keyboard.
// Therefore, for iOS we need to wrap the content in `KeyboardAvoidingView`.
const ModalContentWrapper = ({
  children,
}: ScreenWrapperProps): ReactElement => {
  return Platform.OS === "ios" ? (
    <KeyboardAvoidingView style={[{ flex: 1 }]} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  ) : (
    <>{children}</>
  );
};

const CustomModal = ({
  visible,
  onRequestClose,
  modalControls,
  children,
}: TCustomModalControls & ModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={(e) => onRequestClose?.(e)}
      animationType="fade"
      {...modalControls?.modalProps}
      {...modalControls?.modalProps} //kept for backwards compatibility
    >
      {/*Used to fix the select with search box behavior in iOS*/}
      <ModalContentWrapper>
        <TouchableOpacity
          onPress={(e) => onRequestClose?.(e)}
          style={[
            styles.modalContainer,
            styles.modalBackgroundStyle,
            modalControls?.modalBackgroundStyle ,
          ]}
        >
          {/* Added this `TouchableWithoutFeedback` wrapper because of the closing modal on expo web */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <SafeAreaView
              style={[
                styles.modalOptionsContainer,
                modalControls?.modalOptionsContainerStyle
              ]}
            >
              {children}
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </ModalContentWrapper>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackgroundStyle: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalOptionsContainer: {
    maxHeight: "50%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 5,
  },
});

export default CustomModal;
