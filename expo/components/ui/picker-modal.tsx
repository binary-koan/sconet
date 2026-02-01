import { Text } from "@/components/ui/text"
import { XIcon } from "lucide-react-native"
import { ReactNode } from "react"
import { Modal, Pressable, ScrollView, View } from "react-native"
import { Icon } from "./icon"

interface PickerModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  scrollable?: boolean
}

export function PickerModal({
  open,
  onClose,
  title,
  children,
  scrollable = true
}: PickerModalProps) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center bg-black/50 px-4">
        <View className="bg-background max-h-[80%] rounded-xl">
          <View className="border-border flex-row items-center justify-between px-4 pt-4">
            <Text variant="large">{title}</Text>
            <Pressable onPress={onClose}>
              <Icon as={XIcon} className="size-6" />
            </Pressable>
          </View>

          {scrollable ? (
            <ScrollView className="px-4 py-4">{children}</ScrollView>
          ) : (
            <View className="p-4">{children}</View>
          )}
        </View>
      </View>
    </Modal>
  )
}
