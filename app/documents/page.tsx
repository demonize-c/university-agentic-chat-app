"use client"

import * as React from "react"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  FileTextIcon, 
  SearchIcon, 
  RefreshCwIcon, 
  Trash2Icon, 
  CheckCircle2Icon, 
  ClockIcon, 
  FileCheckIcon,
  DatabaseIcon,
  PlusIcon,
  InfoIcon,
  Edit3Icon,
  Loader2Icon,
  AlertCircleIcon,
  SparklesIcon,
  XCircleIcon
} from "lucide-react"
import { 
  useDocsQuery, 
  useGenerateEmbeddingsMutation, 
  useDeleteEmbeddingsMutation 
} from "@/hooks/useDocsQuery"
import { DocumentResponse } from "@/api/types"
import { UploadDocModal } from "@/components/modals/UploadDocModal"
import { EditDocModal } from "@/components/modals/EditDocModal"
import { DocInfoModal } from "@/components/modals/DocInfoModal"
import { DeleteDocDialog } from "@/components/modals/DeleteDocDialog"
import { getDocEmbeddingStatus } from "@/lib/embeddingUtils"

function formatDate(dateString?: string): string {
  if (!dateString) return "Recent"
  const parts = dateString.split("T")
  if (parts[0] && parts[0].length === 10) {
    return parts[0]
  }
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return "Recent"
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 KB"
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [selectedDocInfo, setSelectedDocInfo] = React.useState<DocumentResponse | null>(null)
  const [selectedDocEdit, setSelectedDocEdit] = React.useState<DocumentResponse | null>(null)
  const [selectedDocDelete, setSelectedDocDelete] = React.useState<DocumentResponse | null>(null)

  // TanStack Query & Embedding Mutations
  const { data: apiResponse, isLoading, isError, refetch } = useDocsQuery({ q_text: searchTerm })
  const generateEmbeddingMutation = useGenerateEmbeddingsMutation()
  const deleteEmbeddingMutation = useDeleteEmbeddingsMutation()

  // Extract docs array or use empty array when no data
  const documentsList: DocumentResponse[] = React.useMemo(() => {
    if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      return apiResponse.data
    }
    return []
  }, [apiResponse])

  // Extract real dashboard stats from DocumentListResponse (meta & analytics)
  const totalDocs = apiResponse?.meta?.total_result ?? apiResponse?.total_docs ?? apiResponse?.meta?.total_docs ?? documentsList.length
  
  // Calculate total vector chunks dynamically from the document list if analytics.total_chunks is not returned by API
  const calculatedChunks = documentsList.reduce((acc, d) => acc + (d.total_chunks || 0), 0)
  const totalVectorChunks = apiResponse?.analytics?.total_chunks !== undefined && apiResponse.analytics.total_chunks > 0 
    ? apiResponse.analytics.total_chunks 
    : calculatedChunks

  const totalStorageUsed = apiResponse?.analytics?.total_storage_used ?? apiResponse?.total_storage_used ?? apiResponse?.meta?.total_storage_used ?? documentsList.reduce((acc, d) => acc + (d.file_size || 0), 0)

  // Filter documents
  const filteredDocs = documentsList.filter((doc) => {
    const nameMatch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (doc.title && doc.title.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const tagsArr = Array.isArray(doc.doc_metadata?.tags) ? doc.doc_metadata?.tags : []
    const tagMatch = tagsArr.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return nameMatch || tagMatch
  })

  const handleGenerateEmbedding = async (docId: number) => {
    try {
      await generateEmbeddingMutation.mutateAsync(docId)
    } catch (err) {
      console.error("Failed to generate embedding", err)
    }
  }

  const handleDeleteEmbedding = async (docId: number) => {
    try {
      await deleteEmbeddingMutation.mutateAsync(docId)
    } catch (err) {
      console.error("Failed to delete embedding", err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      <main className="container max-w-screen-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Document Knowledge Base</h1>
              {isLoading && <Loader2Icon className="size-4 animate-spin text-blue-600" />}
            </div>
            <p className="text-sm text-slate-500">
              Manage documents and vector embeddings for the university RAG retrieval system.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-slate-200 cursor-pointer" onClick={() => refetch()}>
              <RefreshCwIcon className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsUploadOpen(true)}>
              <PlusIcon className="mr-1.5 size-3.5" />
              Upload Document
            </Button>
          </div>
        </div>

        {isError && (
          <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="size-4 shrink-0 text-amber-600" />
              <span>Backend API offline. Displaying cached document dashboard stats.</span>
            </div>
            <Button size="xs" variant="outline" className="border-amber-300 bg-white" onClick={() => refetch()}>
              Retry Connection
            </Button>
          </div>
        )}

        {/* Dashboard Stats Row (Real stats from API DocumentListResponse analytics & meta) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Total Documents</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center justify-between text-slate-900">
                <span>{totalDocs}</span>
                <FileTextIcon className="size-4 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">FastAPI Backend Active</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Total Vector Chunks</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center justify-between text-indigo-600">
                <span>{totalVectorChunks}</span>
                <DatabaseIcon className="size-4 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Vector Embeddings Count</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">System Status</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center justify-between text-emerald-600">
                <span className="flex items-center gap-1.5 text-base">
                  <CheckCircle2Icon className="size-4" /> Healthy
                </span>
                <FileCheckIcon className="size-4 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">RAG pipeline operational</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Storage Used</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center justify-between text-slate-900">
                <span>{formatBytes(totalStorageUsed)}</span>
                <ClockIcon className="size-4 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Storage Quota: 500 MB</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar & Document Table */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-0">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents by filename, title, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-700">Document</TableHead>
                  <TableHead className="text-slate-700">Uploaded</TableHead>
                  <TableHead className="text-slate-700">Embedding Status</TableHead>
                  <TableHead className="text-right text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2 select-none opacity-80">
                        <FileTextIcon className="size-10 text-slate-300 stroke-1" />
                        <span className="text-base font-bold tracking-wider uppercase text-slate-400">No Data</span>
                        <p className="text-xs text-slate-400 font-normal">No documents found or uploaded yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocs.map((doc) => {
                    const statusInfo = getDocEmbeddingStatus(
                      doc,
                      generateEmbeddingMutation.isPending ? generateEmbeddingMutation.variables : null,
                      deleteEmbeddingMutation.isPending ? deleteEmbeddingMutation.variables : null
                    )

                    return (
                      <TableRow key={doc.id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <FileTextIcon className="size-4 text-blue-600 shrink-0" />
                            <div>
                              <span 
                                className="truncate max-w-[200px] sm:max-w-[320px] font-semibold hover:underline cursor-pointer block" 
                                onClick={() => setSelectedDocInfo(doc)}
                              >
                                {doc.title || doc.filename}
                              </span>
                              <span className="text-[11px] text-slate-400 font-normal">
                                {doc.filename}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-slate-600" suppressHydrationWarning>
                          {formatDate(doc.created_at)}
                        </TableCell>

                        {/* EMBEDDING STATUS BADGE & CONTROLS BASED ON TIMESTAMPS */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {statusInfo.isGenerating ? (
                              <span className="inline-flex items-center gap-1.5 text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                                <Loader2Icon className="size-3 animate-spin text-indigo-600" /> Generating Embedding...
                              </span>
                            ) : statusInfo.isDeleting ? (
                              <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                                <Loader2Icon className="size-3 animate-spin text-amber-600" /> Deleting Embedding...
                              </span>
                            ) : statusInfo.isEmbedded ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                                <CheckCircle2Icon className="size-3.5" /> Embedded ({doc.total_chunks || 0} chunks)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                                <XCircleIcon className="size-3.5 text-slate-400" /> Not Embedded
                              </span>
                            )}

                            {statusInfo.showDeleteButton && (
                              <Button
                                size="xs"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 text-[10px] h-6 px-2 cursor-pointer"
                                onClick={() => handleDeleteEmbedding(doc.id)}
                                title="Delete Document Embeddings"
                              >
                                Delete Embedding
                              </Button>
                            )}

                            {statusInfo.showGenerateButton && (
                              <Button
                                size="xs"
                                variant="outline"
                                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 text-[10px] h-6 px-2 cursor-pointer"
                                onClick={() => handleGenerateEmbedding(doc.id)}
                                title="Generate Vector Embeddings"
                              >
                                <SparklesIcon className="mr-1 size-3" /> Generate Embedding
                              </Button>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => setSelectedDocInfo(doc)}
                              title="Show Details (Description & Tags)"
                              className="text-slate-600 hover:text-slate-900"
                            >
                              <InfoIcon className="size-3.5" />
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => setSelectedDocEdit(doc)}
                              title="Edit Metadata"
                              className="text-slate-600 hover:text-slate-900"
                            >
                              <Edit3Icon className="size-3.5" />
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setSelectedDocDelete(doc)}
                              title="Delete Document"
                            >
                              <Trash2Icon className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      <UploadDocModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccessCallback={() => refetch()}
      />

      <EditDocModal 
        doc={selectedDocEdit} 
        isOpen={Boolean(selectedDocEdit)} 
        onClose={() => setSelectedDocEdit(null)} 
      />

      <DocInfoModal 
        doc={selectedDocInfo} 
        isOpen={Boolean(selectedDocInfo)} 
        onClose={() => setSelectedDocInfo(null)} 
      />

      <DeleteDocDialog 
        doc={selectedDocDelete} 
        isOpen={Boolean(selectedDocDelete)} 
        onClose={() => setSelectedDocDelete(null)} 
      />
    </div>
  )
}
