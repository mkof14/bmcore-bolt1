export const USER_ID_TABLES = [
  "addon_purchases",
  "admin_users",
  "ai_conversations",
  "analytics_events",
  "black_box_files",
  "chat_message_reactions",
  "chat_messages",
  "chat_participants",
  "chat_sessions",
  "chat_typing_indicators",
  "community_comments",
  "community_posts",
  "contest_entries",
  "daily_snapshots",
  "device_connections",
  "device_data",
  "error_logs",
  "files",
  "goals",
  "habit_completions",
  "habit_logs",
  "habits",
  "health_reports",
  "medical_files",
  "notification_history",
  "notification_queue",
  "nudges",
  "opinion_comparisons",
  "payment_methods",
  "payment_transactions",
  "performance_metrics",
  "push_notifications",
  "push_subscriptions",
  "questionnaire_responses",
  "referral_codes",
  "report_history",
  "report_settings",
  "report_shares",
  "reports",
  "review_helpful_votes",
  "second_opinions",
  "service_lifecycle",
  "service_reviews",
  "session_recordings",
  "shareable_reports",
  "smart_nudges",
  "social_connections",
  "social_media_posts",
  "social_shares",
  "subscription_invoices",
  "subscriptions",
  "support_tickets",
  "sync_logs",
  "team_memberships",
  "testimonials",
  "two_factor_auth",
  "user_badges",
  "user_devices",
  "user_feedback",
  "user_goals",
  "user_personalization",
  "user_roles",
  "user_streaks",
  "user_subscriptions",
  "voice_interactions",
  "wearable_integrations"
];

export const ID_TABLES = ["profiles"];

export async function deleteUserRows(adminClient: any, userId: string) {
  const errors: Array<{ table: string; error: string }> = [];

  for (const table of USER_ID_TABLES) {
    const { error } = await adminClient.from(table).delete().eq("user_id", userId);
    if (error) {
      errors.push({ table, error: error.message || "Unknown error" });
    }
  }

  for (const table of ID_TABLES) {
    const { error } = await adminClient.from(table).delete().eq("id", userId);
    if (error) {
      errors.push({ table, error: error.message || "Unknown error" });
    }
  }

  return errors;
}
