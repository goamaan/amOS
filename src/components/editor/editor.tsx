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
import { cn } from "~/lib/utils"

const extensions = [...defaultExtensions, slashCommand]

export const Editor = ({
  editable = false,
  content,
  setContent,
}: {
  editable?: boolean
  content: string
  setContent?: (content: string) => void
}) => {
  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)

  return (
    <div className="relative self-center">
      <EditorRoot>
        <EditorContent
          initialContent={JSON.parse(content) as JSONContent}
          extensions={extensions}
          className={cn(
            "relative min-h-16 w-full max-w-screen-lg rounded-md bg-background p-1",
            editable && "border p-2",
          )}
          editorProps={{
            ...defaultEditorProps,
            attributes: {
              class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          editable={editable}
          onUpdate={({ editor }) =>
            setContent?.(JSON.stringify(editor.getJSON()))
          }
          slotAfter={<ImageResizer />}
        >
          {editable && (
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
          )}

          {editable && (
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
          )}
        </EditorContent>
      </EditorRoot>
    </div>
  )
}
