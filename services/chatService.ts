import { apiClient } from "@/api/client"
import { APIResponse, ChatMessageRequest, ChatMessageResponse } from "@/api/types"

export const chatService = {
  /**
   * POST /chat/message (or /chat/reply)
   * Send chat query and receive AI answer with RAG sources
   */
  async sendMessage(data: ChatMessageRequest): Promise<APIResponse<ChatMessageResponse>> {
    const response = await apiClient.post<APIResponse<ChatMessageResponse>>("/chat/message", data)
    return response.data
  },
}
