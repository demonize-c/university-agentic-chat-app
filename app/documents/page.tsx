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
  FilterIcon
} from "lucide-react"

interface DocumentItem {
  id: string
  name: string
  category: string
  size: string
  uploadedAt: string
  status: "indexed" | "processing" | "failed"
  vectorCount: number
}

const initialDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    name: "CS101_Syllabus_2026.pdf",
    category: "Course Materials",
    size: "1.2 MB",
    uploadedAt: "2026-08-28",
    status: "indexed",
    vectorCount: 142,
  },
  {
    id: "doc-2",
    name: "University_Academic_Guidelines.pdf",
    category: "Campus Policies",
    size: "4.5 MB",
    uploadedAt: "2026-08-25",
    status: "indexed",
    vectorCount: 520,
  },
  {
    id: "doc-3",
    name: "Agentic_AI_Research_Paper.pdf",
    category: "Research",
    size: "2.8 MB",
    uploadedAt: "2026-08-30",
    status: "processing",
    vectorCount: 88,
  },
  {
    id: "doc-4",
    name: "Campus_Facility_Map_and_Rules.docx",
    category: "General Info",
    size: "850 KB",
    uploadedAt: "2026-08-20",
    status: "indexed",
    vectorCount: 94,
  },
  {
    id: "doc-5",
    name: "Exam_Schedule_Fall_2026.pdf",
    category: "Schedules",
    size: "620 KB",
    uploadedAt: "2026-08-29",
    status: "indexed",
    vectorCount: 45,
  },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = React.useState<DocumentItem[]>(initialDocuments)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("All")

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All" || doc.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const handleReindex = (id: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, status: "processing" as const }
      }
      return doc
    }))
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === id) {
          return { ...doc, status: "indexed" as const, vectorCount: doc.vectorCount + 10 }
        }
        return doc
      }))
    }, 1500)
  }

  const categories = ["All", "Course Materials", "Campus Policies", "Research", "General Info", "Schedules"]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      <main className="container max-w-screen-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Document Knowledge Base</h1>
            <p className="text-sm text-slate-500">
              Manage documents indexed for the university agentic chat retrieval system.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-slate-200" onClick={() => setDocuments(initialDocuments)}>
              <RefreshCwIcon className="mr-1.5 size-3.5" />
              Sync Index
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusIcon className="mr-1.5 size-3.5" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Total Documents</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center justify-between text-slate-900">
                <span>{documents.length}</span>
                <FileTextIcon className="size-4 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">+2 added this week</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Indexed Vectors</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center justify-between text-slate-900">
                <span>{documents.reduce((acc, d) => acc + d.vectorCount, 0)}</span>
                <DatabaseIcon className="size-4 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Vector DB: Chroma / pgvector</p>
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
              <p className="text-xs text-slate-500">All services operational</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Storage Used</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center justify-between text-slate-900">
                <span>9.97 MB</span>
                <ClockIcon className="size-4 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Quota: 500 MB</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <FilterIcon className="size-3.5 text-slate-400" />
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      size="xs"
                      variant={categoryFilter === cat ? "secondary" : "ghost"}
                      onClick={() => setCategoryFilter(cat)}
                      className={categoryFilter === cat ? "bg-slate-200 text-slate-900 font-medium" : "text-slate-600"}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-700">Document Name</TableHead>
                  <TableHead className="text-slate-700">Category</TableHead>
                  <TableHead className="text-slate-700">Size</TableHead>
                  <TableHead className="text-slate-700">Uploaded</TableHead>
                  <TableHead className="text-slate-700">Vectors</TableHead>
                  <TableHead className="text-slate-700">Status</TableHead>
                  <TableHead className="text-right text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-slate-500">
                      No documents found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocs.map((doc) => (
                    <TableRow key={doc.id} className="border-slate-100 hover:bg-slate-50">
                      <TableCell className="font-medium flex items-center gap-2 text-slate-900">
                        <FileTextIcon className="size-4 text-blue-600 shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-[300px]">{doc.name}</span>
                      </TableCell>
                      <TableCell className="text-slate-600">{doc.category}</TableCell>
                      <TableCell className="text-slate-600">{doc.size}</TableCell>
                      <TableCell className="text-slate-600">{doc.uploadedAt}</TableCell>
                      <TableCell className="text-slate-600">{doc.vectorCount}</TableCell>
                      <TableCell>
                        {doc.status === "indexed" && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium text-[11px]">
                            <CheckCircle2Icon className="size-3.5" /> Indexed
                          </span>
                        )}
                        {doc.status === "processing" && (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium text-[11px]">
                            <RefreshCwIcon className="size-3.5 animate-spin" /> Processing
                          </span>
                        )}
                        {doc.status === "failed" && (
                          <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-medium text-[11px]">
                            Failed
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => handleReindex(doc.id)}
                            title="Re-index document"
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <RefreshCwIcon className="size-3" />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(doc.id)}
                            title="Delete document"
                          >
                            <Trash2Icon className="size-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
