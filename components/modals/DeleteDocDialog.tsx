"use client"

import * as React from "react"
import { DocumentResponse } from "@/api/types"
import { useDeleteDocMutation } from "@/hooks/useDocsQuery"
import { Button } from "@/components/ui/button"
import { 
  Trash2Icon, 
  XIcon, 
  Loader2Icon, 
  AlertTriangleIcon 
} from "lucide-react"

interface DeleteDocDialogProps {
  doc: DocumentResponse | null
  isOpen: boolean
  onClose: () => void
}

export function DeleteDocDialog({ doc, isOpen, onClose }: DeleteDocDialogProps) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const deleteMutation = useDeleteDocMutation()

  if (!isOpen || !doc) return null

  const handleDelete = async () => {
    try {
      setErrorMessage(null)
      await deleteMutation.mutateAsync(doc.id)
      onClose()
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || "Failed to delete document.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangleIcon className="size-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Delete Document</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <XIcon className="size-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <p className="text-slate-600 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-slate-900">"{doc.title || doc.filename}"</span>?
          This action will remove the document and its RAG vector embeddings.
        </p>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button 
            size="sm" 
            className="bg-red-600 hover:bg-red-700 text-white" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2Icon className="mr-1.5 size-3.5 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2Icon className="mr-1.5 size-3.5" /> Confirm Delete
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
