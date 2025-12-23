// Plan mental model (locked):
// - A plan is a reusable template used to start sessions.
// - Plans fully own their days, blocks, and exercises.
// - Sessions snapshot execution state at creation time.
// - Sessions reference plans by ID for display only.
// - Editing or deleting a plan must not break sessions.
// - The only active state in the system is the active session.
