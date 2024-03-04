"use client"

import { withProps } from "@udecode/cn"
import { createAlignPlugin } from "@udecode/plate-alignment"
import { createAutoformatPlugin } from "@udecode/plate-autoformat"
import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_UNDERLINE,
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createUnderlinePlugin,
} from "@udecode/plate-basic-marks"
import {
  ELEMENT_BLOCKQUOTE,
  createBlockquotePlugin,
} from "@udecode/plate-block-quote"
import {
  createExitBreakPlugin,
  createSoftBreakPlugin,
} from "@udecode/plate-break"
import { createCaptionPlugin } from "@udecode/plate-caption"
import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_CODE_SYNTAX,
  createCodeBlockPlugin,
} from "@udecode/plate-code-block"
import { createComboboxPlugin } from "@udecode/plate-combobox"
import {
  Plate,
  PlateLeaf,
  createPlugins,
  type RenderAfterEditable,
} from "@udecode/plate-common"
import { createDndPlugin } from "@udecode/plate-dnd"
import { createEmojiPlugin } from "@udecode/plate-emoji"
import { createExcalidrawPlugin } from "@udecode/plate-excalidraw"
import {
  createFontBackgroundColorPlugin,
  createFontColorPlugin,
  createFontSizePlugin,
} from "@udecode/plate-font"
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  createHeadingPlugin,
} from "@udecode/plate-heading"
import { MARK_HIGHLIGHT, createHighlightPlugin } from "@udecode/plate-highlight"
import {
  ELEMENT_HR,
  createHorizontalRulePlugin,
} from "@udecode/plate-horizontal-rule"
import { createIndentPlugin } from "@udecode/plate-indent"
import { createIndentListPlugin } from "@udecode/plate-indent-list"
import { createJuicePlugin } from "@udecode/plate-juice"
import { MARK_KBD, createKbdPlugin } from "@udecode/plate-kbd"
import { createLineHeightPlugin } from "@udecode/plate-line-height"
import { ELEMENT_LINK, createLinkPlugin } from "@udecode/plate-link"
import { ELEMENT_TODO_LI, createTodoListPlugin } from "@udecode/plate-list"
import {
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  createImagePlugin,
  createMediaEmbedPlugin,
} from "@udecode/plate-media"
import {
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  createMentionPlugin,
} from "@udecode/plate-mention"
import { createNodeIdPlugin } from "@udecode/plate-node-id"
import {
  ELEMENT_PARAGRAPH,
  createParagraphPlugin,
} from "@udecode/plate-paragraph"
import { createResetNodePlugin } from "@udecode/plate-reset-node"
import { createDeletePlugin } from "@udecode/plate-select"
import { createBlockSelectionPlugin } from "@udecode/plate-selection"
import { createDeserializeCsvPlugin } from "@udecode/plate-serializer-csv"
import { createDeserializeDocxPlugin } from "@udecode/plate-serializer-docx"
import { createDeserializeMdPlugin } from "@udecode/plate-serializer-md"
import { createTabbablePlugin } from "@udecode/plate-tabbable"
import {
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TH,
  ELEMENT_TR,
  createTablePlugin,
} from "@udecode/plate-table"
import { ELEMENT_TOGGLE, createTogglePlugin } from "@udecode/plate-toggle"
import { createTrailingBlockPlugin } from "@udecode/plate-trailing-block"
import { DndProvider } from "react-dnd"

import { HTML5Backend } from "react-dnd-html5-backend"
import { BlockquoteElement } from "~/components/plate-ui/blockquote-element"
import { CodeBlockElement } from "~/components/plate-ui/code-block-element"
import { CodeLeaf } from "~/components/plate-ui/code-leaf"
import { CodeLineElement } from "~/components/plate-ui/code-line-element"
import { CodeSyntaxLeaf } from "~/components/plate-ui/code-syntax-leaf"
import { Editor } from "~/components/plate-ui/editor"
import { EmojiCombobox } from "~/components/plate-ui/emoji-combobox"
import { FixedToolbar } from "~/components/plate-ui/fixed-toolbar"
import { FixedToolbarButtons } from "~/components/plate-ui/fixed-toolbar-buttons"
import { FloatingToolbar } from "~/components/plate-ui/floating-toolbar"
import { FloatingToolbarButtons } from "~/components/plate-ui/floating-toolbar-buttons"
import { HeadingElement } from "~/components/plate-ui/heading-element"
import { HighlightLeaf } from "~/components/plate-ui/highlight-leaf"
import { HrElement } from "~/components/plate-ui/hr-element"
import { ImageElement } from "~/components/plate-ui/image-element"
import { KbdLeaf } from "~/components/plate-ui/kbd-leaf"
import { LinkElement } from "~/components/plate-ui/link-element"
import { LinkFloatingToolbar } from "~/components/plate-ui/link-floating-toolbar"
import { MediaEmbedElement } from "~/components/plate-ui/media-embed-element"
import { MentionCombobox } from "~/components/plate-ui/mention-combobox"
import { MentionElement } from "~/components/plate-ui/mention-element"
import { MentionInputElement } from "~/components/plate-ui/mention-input-element"
import { ParagraphElement } from "~/components/plate-ui/paragraph-element"
import { withPlaceholders } from "~/components/plate-ui/placeholder"
import {
  TableCellElement,
  TableCellHeaderElement,
} from "~/components/plate-ui/table-cell-element"
import { TableElement } from "~/components/plate-ui/table-element"
import { TableRowElement } from "~/components/plate-ui/table-row-element"
import { TodoListElement } from "~/components/plate-ui/todo-list-element"
import { ToggleElement } from "~/components/plate-ui/toggle-element"
import { withDraggables } from "~/components/plate-ui/with-draggables"

const plugins = createPlugins(
  [
    createParagraphPlugin(),
    createHeadingPlugin(),
    createBlockquotePlugin(),
    createCodeBlockPlugin(),
    createHorizontalRulePlugin(),
    createLinkPlugin({
      renderAfterEditable: LinkFloatingToolbar as RenderAfterEditable,
    }),
    createImagePlugin(),
    createMediaEmbedPlugin(),
    createCaptionPlugin({
      options: {
        pluginKeys: [
          // ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED
        ],
      },
    }),
    createMentionPlugin(),
    createTodoListPlugin(),
    createExcalidrawPlugin(),
    createTogglePlugin(),
    createTablePlugin(),
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createCodePlugin(),
    createSubscriptPlugin(),
    createSuperscriptPlugin(),
    createFontColorPlugin(),
    createFontBackgroundColorPlugin(),
    createFontSizePlugin(),
    createHighlightPlugin(),
    createKbdPlugin(),
    createAlignPlugin({
      inject: {
        props: {
          validTypes: [
            ELEMENT_PARAGRAPH,
            // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3
          ],
        },
      },
    }),
    createIndentPlugin({
      inject: {
        props: {
          validTypes: [
            ELEMENT_PARAGRAPH,
            // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK
          ],
        },
      },
    }),
    createIndentListPlugin({
      inject: {
        props: {
          validTypes: [
            ELEMENT_PARAGRAPH,
            // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK
          ],
        },
      },
    }),
    createLineHeightPlugin({
      inject: {
        props: {
          defaultNodeValue: 1.5,
          validNodeValues: [1, 1.2, 1.5, 2, 3],
          validTypes: [
            ELEMENT_PARAGRAPH,
            // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3
          ],
        },
      },
    }),
    createAutoformatPlugin({
      options: {
        rules: [
          // Usage: https://platejs.org/docs/autoformat
        ],
        enableUndoOnDelete: true,
      },
    }),
    createBlockSelectionPlugin({
      options: {
        sizes: {
          top: 0,
          bottom: 0,
        },
      },
    }),
    createComboboxPlugin(),
    createDndPlugin({
      options: { enableScroller: true },
    }),
    createEmojiPlugin({
      renderAfterEditable: EmojiCombobox,
    }),
    createExitBreakPlugin({
      options: {
        rules: [
          {
            hotkey: "mod+enter",
          },
          {
            hotkey: "mod+shift+enter",
            before: true,
          },
          {
            hotkey: "enter",
            query: {
              start: true,
              end: true,
              // allow: KEYS_HEADING,
            },
            relative: true,
            level: 1,
          },
        ],
      },
    }),
    createNodeIdPlugin(),
    createResetNodePlugin({
      options: {
        rules: [
          // Usage: https://platejs.org/docs/reset-node
        ],
      },
    }),
    createDeletePlugin(),
    createSoftBreakPlugin({
      options: {
        rules: [
          { hotkey: "shift+enter" },
          {
            hotkey: "enter",
            query: {
              allow: [
                // ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD
              ],
            },
          },
        ],
      },
    }),
    createTabbablePlugin(),
    createTrailingBlockPlugin({
      options: { type: ELEMENT_PARAGRAPH },
    }),
    createDeserializeDocxPlugin(),
    createDeserializeCsvPlugin(),
    createDeserializeMdPlugin(),
    createJuicePlugin(),
  ],
  {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    components: withDraggables(
      withPlaceholders({
        [ELEMENT_BLOCKQUOTE]: BlockquoteElement,
        [ELEMENT_CODE_BLOCK]: CodeBlockElement,
        [ELEMENT_CODE_LINE]: CodeLineElement,
        [ELEMENT_CODE_SYNTAX]: CodeSyntaxLeaf,
        [ELEMENT_HR]: HrElement,
        [ELEMENT_IMAGE]: ImageElement,
        [ELEMENT_LINK]: LinkElement,
        [ELEMENT_TOGGLE]: ToggleElement,
        [ELEMENT_H1]: withProps(HeadingElement, { variant: "h1" }),
        [ELEMENT_H2]: withProps(HeadingElement, { variant: "h2" }),
        [ELEMENT_H3]: withProps(HeadingElement, { variant: "h3" }),
        [ELEMENT_H4]: withProps(HeadingElement, { variant: "h4" }),
        [ELEMENT_H5]: withProps(HeadingElement, { variant: "h5" }),
        [ELEMENT_H6]: withProps(HeadingElement, { variant: "h6" }),
        [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
        [ELEMENT_MENTION]: MentionElement,
        [ELEMENT_MENTION_INPUT]: MentionInputElement,
        [ELEMENT_PARAGRAPH]: ParagraphElement,
        [ELEMENT_TABLE]: TableElement,
        [ELEMENT_TR]: TableRowElement,
        [ELEMENT_TD]: TableCellElement,
        [ELEMENT_TH]: TableCellHeaderElement,
        [ELEMENT_TODO_LI]: TodoListElement,
        [MARK_BOLD]: withProps(PlateLeaf, { as: "strong" }),
        [MARK_CODE]: CodeLeaf,
        [MARK_HIGHLIGHT]: HighlightLeaf,
        [MARK_ITALIC]: withProps(PlateLeaf, { as: "em" }),
        [MARK_KBD]: KbdLeaf,
        [MARK_STRIKETHROUGH]: withProps(PlateLeaf, { as: "s" }),
        [MARK_SUBSCRIPT]: withProps(PlateLeaf, { as: "sub" }),
        [MARK_SUPERSCRIPT]: withProps(PlateLeaf, { as: "sup" }),
        [MARK_UNDERLINE]: withProps(PlateLeaf, { as: "u" }),
      }),
    ),
  },
)

export function TextEditor({}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        plugins={plugins}
        initialValue={[
          {
            id: "1",
            type: "p",
            children: [{ text: "Hello, World!" }],
          },
        ]}
      >
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>

        <Editor />

        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
        <MentionCombobox items={[]} />
      </Plate>
    </DndProvider>
  )
}
