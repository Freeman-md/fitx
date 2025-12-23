// Plan mental model (locked):
// - A plan fully owns its days, and days/blocks/exercises are not shared across plans.
// - Sessions reference plans and days by ID only.
// - Editing a plan must never mutate existing or past sessions.
// - Sessions are immutable historical records once completed.
// - Plans can be active or archived; only one plan is active at any time.
// - Archived plans cannot be selected for new sessions.
