"use client"

import * as React from "react"
import { DocumentResponse } from "@/api/types"
import { useUpdateDocMutation } from "@/hooks/useDocsQuery"
import { Button } from "@/components/ui/button"
import { 
  Edit3Icon, 
  XIcon, 
  Loader2Icon, 
  AlertCircleIcon,
  AlignLeftIcon,
  TagIcon,
  SparklesIcon
} from "lucide-react"

import { getDocEmbeddingStatus } from "@/lib/embeddingUtils"

interface EditDocModalProps {
  doc: DocumentResponse | null
  isOpen: boolean
  onClose: () => void
}

export function EditDocModal({ doc, isOpen, onClose }: EditDocModalProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [tags, setTags] = React.useState("")
  const [generateEmbedding, setGenerateEmbedding] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const updateMutation = useUpdateDocMutation()

  React.useEffect(() => {
    if (doc) {
      setTitle(doc.title || doc.filename || "")
      const meta = doc.doc_metadata || {}
      setDescription(meta.description || "")
      
      const tagsVal = meta.tags
      if (Array.isArray(tagsVal)) {
        setTags(tagsVal.join(", "))
      } else if (typeof tagsVal === "string") {
        setTags(tagsVal)
      } else {
        setTags("")
      }

      const statusInfo = getDocEmbeddingStatus(doc)
      setGenerateEmbedding(statusInfo.showGenerateButton || statusInfo.isGenerating)
      setErrorMessage(null)
    }
  }, [doc])

  if (!isOpen || !doc) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const updatedMetadata = {
      ...(doc.doc_metadata || {}),
      description: description.trim(),
      tags: tagsArray,
    }

    try {
      await updateMutation.mutateAsync({
        id: doc.id,
        data: {
          title: title.trim(),
          metadata: updatedMetadata,
          generate_embedding: generateEmbedding,
        },
        generate_embedding: generateEmbedding,
      })
      onClose()
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || "Failed to update document.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Edit3Icon className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit Document</h2>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">{doc.filename}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <XIcon className="size-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700">
            <AlertCircleIcon className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Document Title */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Document Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium" 
            />
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <AlignLeftIcon className="size-3.5 text-blue-500" /> Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              placeholder="Enter document description..."
            />
          </div>

          {/* Tags Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <TagIcon className="size-3.5 text-blue-500" /> Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags (e.g. syllabus, cs101)"
              className="w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
            />
          </div>

          {/* GENERATE EMBEDDING SWITCH / CHECKBOX BUTTON */}
          {(() => {
            const statusInfo = getDocEmbeddingStatus(doc)
            return (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <SparklesIcon className="size-3.5 text-indigo-600" /> Generate Embedding
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {statusInfo.isGenerating
                      ? "Embedding generation is currently in progress..."
                      : statusInfo.isDeleting
                      ? "Embedding deletion is currently in progress..."
                      : statusInfo.isEmbedded
                      ? "Embedding is currently active"
                      : "Embedding not generated or deleted"}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateEmbedding}
                    disabled={statusInfo.isProcessing}
                    onChange={(e) => setGenerateEmbedding(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
                </label>
              </div>
            )
          })()}

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2Icon className="mr-1.5 size-3.5 animate-spin" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
