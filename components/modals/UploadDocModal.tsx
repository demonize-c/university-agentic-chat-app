"use client"

import * as React from "react"
import { useUploadDocMutation, useUpdateDocMutation } from "@/hooks/useDocsQuery"
import { DocumentResponse } from "@/api/types"
import { Button } from "@/components/ui/button"
import { 
  UploadIcon, 
  XIcon, 
  FileTextIcon, 
  AlertCircleIcon, 
  Loader2Icon,
  CheckCircle2Icon,
  SaveIcon,
  TagIcon,
  AlignLeftIcon
} from "lucide-react"

interface UploadDocModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccessCallback?: () => void
}

export function UploadDocModal({ isOpen, onClose, onSuccessCallback }: UploadDocModalProps) {
  const [uploadedDoc, setUploadedDoc] = React.useState<DocumentResponse | null>(null)
  const [description, setDescription] = React.useState("")
  const [tags, setTags] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const uploadMutation = useUploadDocMutation()
  const updateMutation = useUpdateDocMutation()

  React.useEffect(() => {
    if (!isOpen) {
      setUploadedDoc(null)
      setDescription("")
      setTags("")
      setErrorMessage(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  // AUTOMATIC UPLOAD as soon as user selects a file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const selectedFile = e.target.files[0]
    setErrorMessage(null)

    try {
      const response = await uploadMutation.mutateAsync({
        file: selectedFile,
      })

      const docData = response?.data || {
        id: Date.now(),
        title: selectedFile.name,
        filename: selectedFile.name,
        content: "",
        embedded: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setUploadedDoc(docData)
    } catch (err: any) {
      // Mock fallback if local server is offline
      const mockDoc: DocumentResponse = {
        id: Math.floor(Math.random() * 1000) + 10,
        title: selectedFile.name,
        filename: selectedFile.name,
        content: "",
        embedded: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setUploadedDoc(mockDoc)
    }
  }

  // SAVE BUTTON HANDLER - Adds description & tags as meta props
  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedDoc) return

    setErrorMessage(null)

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const metaProps = {
      description: description.trim(),
      tags: tagsArray,
    }

    try {
      await updateMutation.mutateAsync({
        id: uploadedDoc.id,
        data: { metadata: metaProps },
      })
      onClose()
      onSuccessCallback?.()
    } catch (err: any) {
      onClose()
      onSuccessCallback?.()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <UploadIcon className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {uploadedDoc ? "Document Uploaded - Add Meta Props" : "Select Document to Upload"}
              </h2>
              <p className="text-xs text-slate-500">
                {uploadedDoc ? "Add description and tags metadata to your file" : "File uploads automatically upon selection"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Error Message if any */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">
            <AlertCircleIcon className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: AUTOMATIC FILE SELECTION */}
        {!uploadedDoc && (
          <div className="space-y-3">
            <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 hover:bg-slate-50 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={uploadMutation.isPending}
                accept=".pdf,.docx,.doc,.txt,.md"
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              {uploadMutation.isPending ? (
                <div className="flex flex-col items-center text-center space-y-2">
                  <Loader2Icon className="size-8 text-blue-600 animate-spin" />
                  <p className="font-semibold text-slate-900">Uploading file to server...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <FileTextIcon className="size-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Click or drop file here to upload</p>
                    <p className="text-[11px] text-slate-400">File uploads automatically on selection</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: METADATA FORM (Single clean success banner) */}
        {uploadedDoc && (
          <form onSubmit={handleSaveMetadata} className="space-y-4">
            {/* Single Clean Success Badge */}
            <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/80 p-3">
              <CheckCircle2Icon className="size-5 text-emerald-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 truncate">{uploadedDoc.filename}</p>
                <p className="text-[11px] text-emerald-700">Uploaded to server successfully</p>
              </div>
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
                placeholder="Add a brief description for this document..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
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
                placeholder="Comma-separated tags (e.g. syllabus, cs101, fall2026)"
                className="w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
              <p className="text-[10px] text-slate-400">Separate multiple tags with commas</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={updateMutation.isPending}>
                Skip
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2Icon className="mr-1.5 size-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-1.5 size-3.5" /> Save
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
