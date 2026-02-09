# Migration Notes

## RLS policy consolidation (Feb 2026)

The following RLS-related migrations are **superseded** by
`20260204093000_finalize_rls_policies.sql`, which defines the canonical
policy set for:

- `profiles`
- `email_templates`
- `email_sends`
- `system_settings`

The earlier migrations are retained for history only:

- `20260204090000_fix_admin_rls_policies.sql`
- `20260204091000_fix_system_settings_rls.sql`
- `20260204092000_fix_email_template_select_and_email_sends_policy.sql`

If you are bootstrapping a brand-new database, you can keep all migrations
as‑is (safe due to `DROP POLICY IF EXISTS`), or remove/ignore the earlier
three once you’re ready to prune history.
