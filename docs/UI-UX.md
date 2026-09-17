# UI/UX Direction

The product should feel operational, calm, and trustworthy. Prioritize scan-friendly status tables, explicit next actions, accessible forms, responsive layouts, and status text that does not rely on color alone.

## Approved visual source of truth

The offshore enterprise dashboard composition supplied on 17 September 2026 is the primary design reference. Its defining traits are a compact dark-blue MMMS sidebar, pale-blue operational canvas, global search header, color-coded KPI cards, dense but readable analytics, worker readiness/profile views, and strong oil-and-gas workforce identity. Implementation should adapt this language responsively rather than reproduce unsupported fields or fabricated metrics.

## Sprint 0 visual system

- Direction: offshore enterprise workforce command center; calm precision with information-rich operational visualization.
- Shell: fixed navy sidebar with numbered workflow sections, light gray workspace canvas, compact top bar, and responsive drawer navigation on small screens.
- Accent: teal is reserved for primary actions and positive operational states; amber/red remain reserved for attention and risk.
- Typography: DM Sans with a compact hierarchy so tables, labels, and status chips remain easy to scan during daily operations.
- Surfaces: restrained white panels with fine borders, shallow elevation, and varied spacing. Avoid nested card stacks and fake KPI decoration.
- Interaction: all list screens expose loading, error, empty, search/filter, and retry behavior. Forms use explicit labels, disabled submit feedback, and accessible focus states.
- Content: Indonesian labels are used consistently; metrics and rows are sourced from the API, with no fabricated demo records.

## Screen intent

- Dashboard: surface color-coded workforce KPIs, assignment distribution by site/status, activity ratio, and latest assignments.
- Workers: search/filter the registry, add active workers, and open a structured Worker Profile with readiness, employment, current assignment, and document counts.
- Documents: select a worker and inspect organization-scoped document metadata.
- Pre-Mob: calculate readiness against active requirements and worker documents.
- Admin: maintain position/site document requirements used by the readiness engine.
- Assignments: choose a worker by name, define position/site, and scan lifecycle status.
- Approvals: review pending decisions, add optional comments, and approve/reject from the queue.
- Mobilization / Demobilization: monitor lifecycle records with consistent status and timestamps.
- Reports: analyze workforce status, site and position distribution, then download the organization-scoped assignment CSV.

## Follow-on UX

Document/history tabs, readiness explanations, requirement setup, richer travel forms, and role-specific navigation should be added once their underlying API contracts are production-ready.
