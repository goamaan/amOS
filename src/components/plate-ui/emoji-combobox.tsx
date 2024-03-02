import { type ComboboxItemProps } from "@udecode/plate-combobox"
import {
  KEY_EMOJI,
  useEmojiComboboxState,
  type EmojiItemData,
  type TEmojiCombobox,
} from "@udecode/plate-emoji"

import { Combobox } from "./combobox"

export function EmojiComboboxItem({ item }: ComboboxItemProps<EmojiItemData>) {
  const {
    data: { id, emoji },
  } = item

  return (
    <div>
      {emoji} :{id}:
    </div>
  )
}

export function EmojiCombobox({
  pluginKey = KEY_EMOJI,
  id = pluginKey,
  ...props
}: TEmojiCombobox) {
  const { trigger, onSelectItem } = useEmojiComboboxState({ pluginKey })

  return (
    <Combobox
      id={id}
      trigger={trigger}
      controlled
      onSelectItem={onSelectItem as never}
      onRenderItem={EmojiComboboxItem}
      {...props}
    />
  )
}
