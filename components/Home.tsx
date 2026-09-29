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
  Building2Icon
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="container max-w-screen-2xl p-6 space-y-6">
        {/* Key Knowledge Documents Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <FileTextIcon className="size-5 text-blue-600" /> Key Knowledge Documents
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick access to indexed campus documents and materials
              </p>
            </div>
            <Button asChild size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900">
              <Link href="/documents">
                View All Documents <ArrowRightIcon className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Card className="bg-white border-slate-200 hover:border-blue-300 transition-colors shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-8 items-center justify-center rounded bg-blue-50 text-blue-600">
                    <GraduationCapIcon className="size-4" />
                  </div>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Indexed
                  </span>
                </div>
                <CardTitle className="text-xs font-semibold pt-2 truncate text-slate-900">CS101_Syllabus_2026.pdf</CardTitle>
                <CardDescription className="text-[11px] text-slate-500">Course Materials • 1.2 MB</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <span className="text-[10px] text-slate-400">142 vector chunks</span>
              </CardFooter>
            </Card>

            <Card className="bg-white border-slate-200 hover:border-blue-300 transition-colors shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-8 items-center justify-center rounded bg-emerald-50 text-emerald-600">
                    <Building2Icon className="size-4" />
                  </div>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Indexed
                  </span>
                </div>
                <CardTitle className="text-xs font-semibold pt-2 truncate text-slate-900">University_Academic_Guidelines.pdf</CardTitle>
                <CardDescription className="text-[11px] text-slate-500">Campus Policies • 4.5 MB</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <span className="text-[10px] text-slate-400">520 vector chunks</span>
              </CardFooter>
            </Card>

            <Card className="bg-white border-slate-200 hover:border-blue-300 transition-colors shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-8 items-center justify-center rounded bg-purple-50 text-purple-600">
                    <BookOpenIcon className="size-4" />
                  </div>
                  <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Processing
                  </span>
                </div>
                <CardTitle className="text-xs font-semibold pt-2 truncate text-slate-900">Agentic_AI_Research_Paper.pdf</CardTitle>
                <CardDescription className="text-[11px] text-slate-500">Research • 2.8 MB</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <span className="text-[10px] text-slate-400">88 vector chunks</span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
