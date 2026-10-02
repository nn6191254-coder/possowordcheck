export const analyticsService = {
  record: async (event: { eventType: string; page?: string; metadata?: Record<string, unknown> }) => event,
}
