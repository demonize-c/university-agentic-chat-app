"use client"

import * as React from "react"
import { DocumentResponse } from "@/api/types"
import { Button } from "@/components/ui/button"
import { 
  FileTextIcon, 
  XIcon, 
  DownloadIcon, 
  TagIcon,
  AlignLeftIcon,
  SparklesIcon,
  CheckCircle2Icon,
  XCircleIcon,
  Loader2Icon
} from "lucide-react"
import { getDocEmbeddingStatus } from "@/lib/embeddingUtils"

interface DocInfoModalProps {
  doc: DocumentResponse | null
  isOpen: boolean
  onClose: () => void
}

export function DocInfoModal({ doc, isOpen, onClose }: DocInfoModalProps) {
  if (!isOpen || !doc) return null

  const statusInfo = getDocEmbeddingStatus(doc)

  const handleDownload = () => {
    const blob = new Blob([doc.content || ""], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = doc.filename || `document_${doc.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const meta = doc.doc_metadata || {}
  const description = meta.description || "No description provided for this document."
  
  // Format tags
  let tagsList: string[] = []
  if (Array.isArray(meta.tags)) {
    tagsList = meta.tags
  } else if (typeof meta.tags === "string" && meta.tags.trim()) {
    tagsList = meta.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileTextIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{doc.title || doc.filename}</h2>
              <p className="text-xs text-slate-500 font-mono">#{doc.id} • {doc.filename}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Embedding Status Banner */}
        <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <SparklesIcon className="size-3.5 text-indigo-500" /> Embedding Status
          </span>
          {statusInfo.isGenerating ? (
            <span className="inline-flex items-center gap-1.5 text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full font-semibold text-[11px]">
              <Loader2Icon className="size-3.5 animate-spin text-indigo-600" /> Generating Embedding...
            </span>
          ) : statusInfo.isDeleting ? (
            <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-semibold text-[11px]">
              <Loader2Icon className="size-3.5 animate-spin text-amber-600" /> Deleting Embedding...
            </span>
          ) : statusInfo.isEmbedded ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold text-[11px]">
              <CheckCircle2Icon className="size-3.5" /> Embedded ({doc.total_chunks || 0} chunks)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-200 border border-slate-300 px-2.5 py-1 rounded-full font-semibold text-[11px]">
              <XCircleIcon className="size-3.5 text-slate-500" /> Not Embedded
            </span>
          )}
        </div>

        {/* ONLY Description & Tags */}
        <div className="space-y-4">
          {/* Description */}
          <div className="space-y-1.5">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <AlignLeftIcon className="size-3.5 text-blue-500" /> Description
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-800 leading-relaxed">
              {description}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <TagIcon className="size-3.5 text-blue-500" /> Tags
            </div>
            {tagsList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tagsList.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-blue-700 font-medium text-[11px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-[11px]">No tags assigned to this document.</p>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDownload}>
            <DownloadIcon className="mr-1.5 size-3.5" /> Download File
          </Button>
        </div>
      </div>
    </div>
  )
}
