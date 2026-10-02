export const feedbackService = {
  create: async (payload: { rating: number; message: string; category: string }) => payload,
}
