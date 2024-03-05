"use client"

import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorContent,
  EditorRoot,
  defaultEditorProps,
  type EditorInstance,
  type JSONContent,
} from "novel"
import { ImageResizer } from "novel/extensions"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { defaultExtensions } from "./extensions"
import { ColorSelector } from "./selectors/color-selector"
import { LinkSelector } from "./selectors/link-selector"
import { NodeSelector } from "./selectors/node-selector"

import { Separator } from "~/components/ui/separator"
import { TextButtons } from "./selectors/text-buttons"
import { slashCommand, suggestionItems } from "./slash-command"

const extensions = [...defaultExtensions, slashCommand]

export const Editor = ({
  editable = false,
  content,
  onContentChange,
}: {
  editable?: boolean
  content: string
  onContentChange: (content: string) => void
}) => {
  const [saveStatus, setSaveStatus] = useState("Saved")

  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON()

      onContentChange(JSON.stringify(json))
      setSaveStatus("Saved")
    },
    1000,
  )

  return (
    <div className="relative w-[90%] max-w-screen-md self-center">
      {editable && (
        <div className="z-10 mb-2 w-fit rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
          {saveStatus}
        </div>
      )}
      <EditorRoot>
        <EditorContent
          initialContent={JSON.parse(content) as JSONContent}
          extensions={extensions}
          className="relative min-h-96 w-full max-w-screen-lg rounded-md bg-background p-1"
          editorProps={{
            ...defaultEditorProps,
            attributes: {
              class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          editable={editable}
          onUpdate={({ editor }) => {
            void debouncedUpdates(editor)
            setSaveStatus("Unsaved")
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: "top",
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
          >
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  )
}
