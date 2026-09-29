import { apiClient } from "@/api/client"
import { 
  APIResponse, 
  DocumentListResponse,
  DocumentResponse, 
  DocumentUpdate, 
  GetDocsQueryParams, 
  UploadDocsParams 
} from "@/api/types"

export const docsService = {
  /**
   * GET /docs/
   * Fetch document list with metadata stats (total_docs, total_vector_chunks, total_storage_used)
   */
  async getDocs(params?: GetDocsQueryParams): Promise<DocumentListResponse> {
    const response = await apiClient.get<DocumentListResponse>("/docs/", {
      params,
    })
    return response.data
  },

  /**
   * POST /docs/upload
   * Upload document file
   */
  async uploadDoc(params: UploadDocsParams): Promise<APIResponse<DocumentResponse>> {
    const formData = new FormData()
    formData.append("file", params.file)

    const response = await apiClient.post<APIResponse<DocumentResponse>>("/docs/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  /**
   * GET /docs/{doc_id}
   * Fetch detailed info for a single document
   */
  async getDoc(doc_id: number): Promise<APIResponse<DocumentResponse>> {
    const response = await apiClient.get<APIResponse<DocumentResponse>>(`/docs/${doc_id}`)
    return response.data
  },

  /**
   * PUT /docs/{doc_id}?generate_embedding=...
   * Update document title/metadata with optional embedding generation trigger
   */
  async updateDoc(
    doc_id: number, 
    data: DocumentUpdate, 
    generate_embedding?: boolean
  ): Promise<APIResponse<DocumentResponse>> {
    const response = await apiClient.put<APIResponse<DocumentResponse>>(`/docs/${doc_id}`, data, {
      params: generate_embedding !== undefined ? { generate_embedding } : undefined,
    })
    return response.data
  },

  /**
   * POST /docs/{doc_id}/embeddings/generate
   * Generate vector embeddings for a document
   */
  async generateEmbeddings(doc_id: number): Promise<APIResponse<DocumentResponse>> {
    const response = await apiClient.post<APIResponse<DocumentResponse>>(`/docs/${doc_id}/embeddings/generate`)
    return response.data
  },

  /**
   * DELETE /docs/{doc_id}/embeddings
   * Delete vector embeddings for a document
   */
  async deleteEmbeddings(doc_id: number): Promise<APIResponse<DocumentResponse>> {
    const response = await apiClient.delete<APIResponse<DocumentResponse>>(`/docs/${doc_id}/embeddings`)
    return response.data
  },

  /**
   * DELETE /docs/{doc_id}
   * Delete a document by ID
   */
  async deleteDoc(doc_id: number): Promise<APIResponse<Record<string, any>>> {
    const response = await apiClient.delete<APIResponse<Record<string, any>>>(`/docs/${doc_id}`)
    return response.data
  },
}
