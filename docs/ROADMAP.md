# FlowMind Roadmap

## Completed Features

### Tier 1: Quick Wins (6/6)
- [x] 1.1 Keyboard Shortcuts (Cmd+S, Cmd+E, Cmd+D, D, C, Escape)
- [x] 1.2 Drawing Mode Visual Indicator
- [x] 1.3 Tooltips on Sidebar Components
- [x] 1.4 Sync Status Indicator
- [x] 1.5 Node Duplication (Cmd+D)
- [x] 1.6 Delete Feedback with Undo Toast

### Tier 2: Core UX (7/7)
- [x] 2.1 Responsive Sidebar with Mobile Support
- [x] 2.2 Interactive Onboarding Tour
- [x] 2.3 Snap to Grid Toggle
- [x] 2.4 Visible Zoom Controls
- [x] 2.5 Search and Filter Nodes
- [x] 2.6 Copy/Cut/Paste (Cmd+C/X/V)
- [x] 2.7 Advanced Edge Styling (types, colors, labels)

### Tier 3: Major Features (4/7)
- [x] 3.1 Multiple Export Formats (PNG, SVG, JSON)
- [x] 3.2 Import Diagram from JSON
- [x] 3.3 Diagram Templates (5 pre-built templates)
- [x] 3.4 Multiple Diagram Management (create, rename, delete, switch)

### Bonus
- [x] Diagram Design Guide (Frontend, Backend, Fullstack, AI Agents, Multi-Agent)

---

## Pending Features

### Tier 3: Major Features (Remaining)

#### 3.5 Diagram Metadata
**Priority:** Medium
**Effort:** Low

Add editable title, description, and tags to diagrams.

**Implementation:**
- Create metadata dialog component
- Store metadata in diagram JSON
- Display title in header
- Add search by tags functionality

**Files to modify:**
- `src/lib/storage.ts`
- `src/lib/export.ts`

**New files:**
- `src/components/flow/DiagramMetadata.tsx`

---

#### 3.6 Containers with Auto-Resize
**Priority:** Medium
**Effort:** High

Container nodes that automatically resize to fit children, with collapse/expand functionality.

**Implementation:**
- Create special container node type
- Implement parent-child relationship tracking
- Add auto-resize logic based on children bounds
- Add collapse/expand toggle
- Handle drag constraints for children

**Files to modify:**
- `src/components/flow/BaseNode.tsx`
- `src/config/nodeTypes.ts`
- `src/components/flow/FlowCanvas.tsx`

**New files:**
- `src/components/flow/ContainerNode.tsx`

---

#### 3.7 Node Locking
**Priority:** Low
**Effort:** Low

Lock nodes to prevent accidental movement or editing.

**Implementation:**
- Add `locked` property to node data
- Add lock/unlock button to node context menu
- Disable dragging for locked nodes
- Visual indicator (lock icon) for locked nodes

**Files to modify:**
- `src/components/flow/BaseNode.tsx`
- `src/components/flow/FlowCanvas.tsx`

---

### Tier 4: AI Integration

#### 4.1 AI Assistant for Diagram Generation
**Priority:** High (User Priority)
**Effort:** High

Chat interface or Command Palette (Cmd+K) to generate/modify diagrams via natural language.

**Features:**
- "Add a database connected to the backend"
- "Create a 3-agent system for customer support"
- "Connect all agents to shared memory"
- "Suggest improvements for this architecture"

**Implementation:**
- Create AI assistant panel/dialog
- Integrate with Claude API
- Parse natural language to diagram operations
- Implement command execution engine

**Files to create:**
- `src/components/flow/AIAssistant.tsx`
- `src/lib/ai.ts`
- `src/lib/ai-commands.ts`

**API Requirements:**
- Claude API key
- Prompt engineering for diagram operations

---

### Tier 5: Advanced Features (Future)

#### 5.1 Layer System
Multiple layers (nodes, annotations, background images) with visibility toggle.

#### 5.2 Version History
Save version snapshots, navigate and restore previous versions.

#### 5.3 Smart Connections
Connection suggestions based on node type, highlight compatible targets.

#### 5.4 Public Sharing via Links
Generate shareable read-only links for diagrams.

#### 5.5 Presentation Mode
Fullscreen view with slide navigation between viewport positions.

#### 5.6 Performance Virtualization
Render only visible nodes for 100+ node diagrams.

---

### Tier 6: Platform Expansion (Future)

#### 6.1 Real-time Collaboration
Multiple users editing simultaneously with visible cursors.

#### 6.2 Embed Widget
Embed diagrams in Notion, Confluence via iframe.

#### 6.3 Plugin System
Allow custom node types via plugin API.

#### 6.4 PWA Mobile
Progressive Web App with offline support and touch gestures.

---

## Implementation Priority

| Feature | Priority | Effort | Impact |
|---------|----------|--------|--------|
| 4.1 AI Assistant | High | High | Very High |
| 3.5 Diagram Metadata | Medium | Low | Medium |
| 3.6 Auto-Resize Containers | Medium | High | Medium |
| 3.7 Node Locking | Low | Low | Low |

---

## Technical Debt & Improvements

- [ ] Add comprehensive test coverage
- [ ] Implement error boundaries
- [ ] Add analytics/telemetry
- [ ] Optimize bundle size
- [ ] Add PWA manifest
- [ ] Implement service worker for offline

---

*Last updated: December 24, 2024*
