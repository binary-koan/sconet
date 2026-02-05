import { ReactNode } from "react"
import { KeyboardAvoidingView, Modal, Platform, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface FormModalProps {
  visible: boolean
  onRequestClose: () => void
  children: ReactNode
}

export function FormModal({ visible, onRequestClose, children }: FormModalProps) {
  const insets = useSafeAreaInsets()

  return (
    <Modal
      visible={visible}
      presentationStyle="formSheet"
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View
          className="bg-background flex-1"
          style={{
            paddingTop: Platform.OS === "android" ? insets.top : 0,
            paddingBottom: insets.bottom
          }}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
