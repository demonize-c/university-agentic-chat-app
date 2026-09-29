"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { docsService } from "@/services/docsService"
import { chatService } from "@/services/chatService"
import { 
  DocumentUpdate, 
  GetDocsQueryParams, 
  UploadDocsParams,
  ChatMessageRequest 
} from "@/api/types"

/**
 * Query key factory for document queries
 */
export const docKeys = {
  all: ["docs"] as const,
  lists: () => [...docKeys.all, "list"] as const,
  list: (params?: GetDocsQueryParams) => [...docKeys.lists(), params] as const,
  details: () => [...docKeys.all, "detail"] as const,
  detail: (id: number | null) => [...docKeys.details(), id] as const,
}

/**
 * Hook to fetch paginated list of documents & dashboard stats
 */
/**
 * Hook to fetch paginated list of documents & dashboard stats
 */
export function useDocsQuery(params?: GetDocsQueryParams) {
  return useQuery({
    queryKey: docKeys.list(params),
    queryFn: () => docsService.getDocs(params),
    refetchInterval: (query) => {
      const docs = query.state.data?.data
      if (Array.isArray(docs)) {
        const isAnyProcessing = docs.some((d) => {
          const genStarted = d.embedd_generation_started ? new Date(d.embedd_generation_started).getTime() : null
          const genEnded = d.embedd_generation_ended ? new Date(d.embedd_generation_ended).getTime() : null
          const isGen = Boolean(d.generating_embedding) || (genStarted !== null && (genEnded === null || genStarted > genEnded))

          const delStarted = d.embedd_deletion_started ? new Date(d.embedd_deletion_started).getTime() : null
          const delEnded = d.embedd_deletion_ended ? new Date(d.embedd_deletion_ended).getTime() : null
          const isDel = Boolean(d.deleting_embedding) || (delStarted !== null && (delEnded === null || delStarted > delEnded))

          return isGen || isDel
        })
        if (isAnyProcessing) return 2000
      }
      return false
    },
  })
}

/**
 * Hook to fetch single document details
 */
export function useDocDetailQuery(docId: number | null) {
  return useQuery({
    queryKey: docKeys.detail(docId),
    queryFn: () => docsService.getDoc(docId!),
    enabled: docId !== null && docId !== undefined,
  })
}

/**
 * Hook to upload a document
 * Automatically invalidates document queries on success
 */
export function useUploadDocMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UploadDocsParams) => docsService.uploadDoc(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docKeys.all })
    },
  })
}

/**
 * Hook to update document metadata and optional embedding generation
 */
export function useUpdateDocMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data, generate_embedding }: { id: number; data: DocumentUpdate; generate_embedding?: boolean }) => 
      docsService.updateDoc(id, data, generate_embedding),
    onMutate: async (variables) => {
      await queryClient.invalidateQueries({ queryKey: docKeys.all })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: docKeys.all })
      queryClient.invalidateQueries({ queryKey: docKeys.detail(variables.id) })
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: docKeys.all })
      queryClient.invalidateQueries({ queryKey: docKeys.detail(variables.id) })
    },
  })
}

/**
 * Hook to generate embeddings for a document
 */
export function useGenerateEmbeddingsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (docId: number) => docsService.generateEmbeddings(docId),
    onMutate: async () => {
      await queryClient.invalidateQueries({ queryKey: docKeys.all })
    },
    onSuccess: (_, docId) => {
      queryClient.invalidateQueries({ queryKey: docKeys.all })
      queryClient.invalidateQueries({ queryKey: docKeys.detail(docId) })
    },
    onSettled: (_, __, docId) => {
      queryClient.invalidateQueries({ queryKey: docKeys.all })
      queryClient.invalidateQueries({ queryKey: docKeys.detail(docId) })
    },
  })
}

/**
 * Hook to delete embeddings for a document
 */
export function useDeleteEmbeddingsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (docId: number) => docsService.deleteEmbeddings(docId),
    onMutate: async () => {
      await queryClient.invalidateQueries({ queryKey: docKeys.all })
    },
    onSuccess: (_, docId) => {
      queryClient.invalidateQueries({ queryKey: docKeys.all })
      queryClient.invalidateQueries({ queryKey: docKeys.detail(docId) })
    },
    onSettled: (_, __, docId) => {
      queryClient.invalidateQueries({ queryKey: docKeys.all })
      queryClient.invalidateQueries({ queryKey: docKeys.detail(docId) })
    },
  })
}

/**
 * Hook to delete a document
 */
export function useDeleteDocMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => docsService.deleteDoc(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docKeys.all })
    },
  })
}

/**
 * Hook to send chat message / reply query
 */
export function useChatMessageMutation() {
  return useMutation({
    mutationFn: (data: ChatMessageRequest) => chatService.sendMessage(data),
  })
}
