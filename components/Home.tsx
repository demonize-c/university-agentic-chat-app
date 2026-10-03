"use client"

import * as React from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  FileTextIcon, 
  ArrowRightIcon, 
  BookOpenIcon,
  GraduationCapIcon,
  Building2Icon,
  Loader2Icon,
  InfoIcon,
  PlusIcon,
  SparklesIcon,
  RefreshCwIcon
} from "lucide-react"
import { useDocsQuery } from "@/hooks/useDocsQuery"
import { DocumentResponse } from "@/api/types"
import { UploadDocModal } from "@/components/modals/UploadDocModal"
import { DocInfoModal } from "@/components/modals/DocInfoModal"
import { getDocEmbeddingStatus } from "@/lib/embeddingUtils"
import { ChatWindow } from "@/components/chat-window"

export default function Home() {
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [selectedDocInfo, setSelectedDocInfo] = React.useState<DocumentResponse | null>(null)

  // TanStack Query Hook
  const { data: apiResponse, isLoading, refetch } = useDocsQuery()

  const documentsList: DocumentResponse[] = React.useMemo(() => {
    if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      return apiResponse.data.slice(0, 6)
    }
    return []
  }, [apiResponse])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="container max-w-screen-2xl p-6 space-y-6">
        {/* Key Knowledge Documents Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <FileTextIcon className="size-5 text-blue-600" /> Key Knowledge Documents
                </h1>
                {isLoading && <Loader2Icon className="size-4 animate-spin text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick access to indexed campus documents for RAG retrieval
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="border-slate-200 cursor-pointer" onClick={() => refetch()}>
                <RefreshCwIcon className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" onClick={() => setIsUploadOpen(true)}>
                <PlusIcon className="mr-1.5 size-3.5" />
                Upload File
              </Button>
            </div>
          </div>

          {documentsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-slate-200 border-dashed rounded-xl text-center select-none shadow-xs">
              <FileTextIcon className="size-12 text-slate-300 stroke-1 mb-2 opacity-80" />
              <span className="text-base font-bold tracking-wider uppercase text-slate-400">No Data</span>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                No documents uploaded yet. Upload your first campus document to populate the knowledge base.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {documentsList.map((doc) => {
                const meta = doc.doc_metadata || {}
                const tagsArr: string[] = Array.isArray(meta.tags) ? meta.tags : []
                const statusInfo = getDocEmbeddingStatus(doc)

                return (
                  <Card 
                    key={doc.id} 
                    className="bg-white border-slate-200 hover:border-blue-300 transition-colors shadow-xs cursor-pointer flex flex-col justify-between"
                    onClick={() => setSelectedDocInfo(doc)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex size-8 items-center justify-center rounded bg-blue-50 text-blue-600">
                          <FileTextIcon className="size-4" />
                        </div>
                        {statusInfo.isGenerating ? (
                          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Loader2Icon className="size-3 animate-spin text-indigo-600" /> Generating
                          </span>
                        ) : statusInfo.isDeleting ? (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Loader2Icon className="size-3 animate-spin text-amber-600" /> Deleting
                          </span>
                        ) : statusInfo.isEmbedded ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Embedded
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                            Not Embedded
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xs font-semibold pt-2 truncate text-slate-900">
                        {doc.title || doc.filename}
                      </CardTitle>
                      <CardDescription className="text-[11px] text-slate-500 line-clamp-2">
                        {meta.description || doc.filename}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-2 flex justify-between items-center border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-1 overflow-hidden">
                        {tagsArr.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] text-blue-600 font-medium flex items-center gap-0.5 shrink-0">
                        Details <InfoIcon className="size-3" />
                      </span>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <UploadDocModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccessCallback={() => refetch()}
      />

      <DocInfoModal 
        doc={selectedDocInfo} 
        isOpen={Boolean(selectedDocInfo)} 
        onClose={() => setSelectedDocInfo(null)} 
      />
      <ChatWindow/>
    </div>
  )
}
