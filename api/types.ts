/**
 * TypeScript Interfaces based on updated OpenAPI specification
 */

export interface APIResponse<T> {
  status_code: number
  message: string
  data: T
}

export interface PaginationMeta {
  page: number
  page_size: number
  total_pages: number
  total_result: number
  total_docs?: number | null
  total_vector_chunks?: number
  total_chunks?: number
  total_storage_used?: number
  q_text?: string | null
}

export interface DocumentAnalytics {
  total_chunks?: number
  total_storage_used?: number
}

export interface DocumentResponse {
  id: number
  title: string
  content: string
  filename: string
  original_file_path?: string | null
  extension?: string | null
  file_size?: number | null
  doc_metadata?: Record<string, any> | null
  embedded: boolean
  generating_embedding?: boolean
  deleting_embedding?: boolean
  embedd_generation_started?: string | null
  embedd_generation_ended?: string | null
  embedd_deletion_started?: string | null
  embedd_deletion_ended?: string | null
  total_chunks?: number
  created_at: string
  updated_at: string
}

export interface DocumentListResponse {
  status_code: number
  message: string
  data: DocumentResponse[]
  meta: PaginationMeta
  analytics?: DocumentAnalytics
  total_docs?: number | null
  total_vector_chunks?: number
  total_storage_used?: number
}

export interface DocumentUpdate {
  title?: string | null
  metadata?: Record<string, any> | null
  generate_embedding?: boolean | null
}

export interface UploadDocsParams {
  file: File
}

export interface GetDocsQueryParams {
  page?: number
  page_size?: number
  q_text?: string
}

export interface ChatMessageRequest {
  query: string
  doc_id?: number | null
  k?: number
  model_id?: string | null
}

export interface ChatSourceItem {
  content: string
  source: string
  page?: number | null
  metadata?: Record<string, any> | null
}

export interface ChatMessageResponse {
  query: string
  reply: string
  sources: ChatSourceItem[]
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
  input?: any
  ctx?: Record<string, any>
}

export interface HTTPValidationError {
  detail?: ValidationError[]
}
