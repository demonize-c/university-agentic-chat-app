import { DocumentResponse } from "@/api/types"

export interface EmbeddingStatusInfo {
  isGenerating: boolean
  isDeleting: boolean
  isProcessing: boolean
  isEmbedded: boolean
  showGenerateButton: boolean
  showDeleteButton: boolean
}

/**
  * Evaluates doc embedding state based on generation/deletion timestamps and flags.
  * - if embedd_generation_started is set and embedd_generation_ended is null (or started > ended), generation is active.
  * - if embedd_deletion_started is set and embedd_deletion_ended is null (or started > ended), deletion is active.
  */
export function getDocEmbeddingStatus(
  doc: DocumentResponse,
  pendingGenerateId?: number | null,
  pendingDeleteId?: number | null
): EmbeddingStatusInfo {
  const isMutatingGenerate = pendingGenerateId === doc.id
  const isMutatingDelete = pendingDeleteId === doc.id

  const genStarted = doc.embedd_generation_started ? new Date(doc.embedd_generation_started).getTime() : null
  const genEnded = doc.embedd_generation_ended ? new Date(doc.embedd_generation_ended).getTime() : null

  const isGenerating =
    Boolean(doc.generating_embedding) ||
    (genStarted !== null && (genEnded === null || genStarted > genEnded)) ||
    isMutatingGenerate

  const delStarted = doc.embedd_deletion_started ? new Date(doc.embedd_deletion_started).getTime() : null
  const delEnded = doc.embedd_deletion_ended ? new Date(doc.embedd_deletion_ended).getTime() : null

  const isDeleting =
    Boolean(doc.deleting_embedding) ||
    (delStarted !== null && (delEnded === null || delStarted > delEnded)) ||
    isMutatingDelete

  const isProcessing = isGenerating || isDeleting
  const isEmbedded = Boolean(doc.embedded) && !isDeleting

  const showGenerateButton = !isEmbedded && !isProcessing
  const showDeleteButton = isEmbedded && !isProcessing

  return {
    isGenerating,
    isDeleting,
    isProcessing,
    isEmbedded,
    showGenerateButton,
    showDeleteButton,
  }
}
