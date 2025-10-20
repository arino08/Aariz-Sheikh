# 🎯 Visual Workflow Guide

## Admin System Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                     USER VISITS PORTFOLIO                    │
│                   (Normal browsing experience)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Presses Ctrl+K
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   MINI TERMINAL OPENS                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  mini-terminal                                      ⓧ  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  visitor@admin:~$                                      │ │
│  │  Welcome to Admin Terminal                             │ │
│  │  Type 'help' for available commands                    │ │
│  │                                                         │ │
│  │  visitor@admin:~$ _                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│          Press ESC to close                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Types "az8576"
                              │ Presses Enter
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION SUCCESS                      │
│  visitor@admin:~$ az8576                                    │
│  ✓ Authentication successful!                               │
│  Opening admin panel...                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Opens automatically
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL OPENS                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ⚫ ⚫ ⚫  Admin Panel - Project Management        ⓧ  │ │
│  ├─────────────────────┬──────────────────────────────────┤ │
│  │  ADD NEW PROJECT    │   EXISTING PROJECTS (5)          │ │
│  │                     │                                  │ │
│  │  Title: *          │   ┌─────────────────────────┐   │ │
│  │  [           ]     │   │ Terminal Portfolio  ★   │   │ │
│  │                     │   │ Interactive terminal... │   │ │
│  │  Short Desc: *     │   │ Next.js TypeScript     │   │ │
│  │  [           ]     │   │ [Edit] [Delete]        │   │ │
│  │                     │   └─────────────────────────┘   │ │
│  │  Description: *    │                                  │ │
│  │  [           ]     │   ┌─────────────────────────┐   │ │
│  │  [           ]     │   │ E-Commerce Platform     │   │ │
│  │                     │   │ Full-stack solution... │   │ │
│  │  Tech Stack: *     │   │ React Node.js MongoDB  │   │ │
│  │  [           ]     │   │ [Edit] [Delete]        │   │ │
│  │                     │   └─────────────────────────┘   │ │
│  │  Image:            │                                  │ │
│  │  [Choose File]     │   ... more projects ...         │ │
│  │  ✓ Image uploaded  │                                  │ │
│  │                     │                                  │ │
│  │  Project URL:      │                                  │ │
│  │  [           ]     │                                  │ │
│  │                     │                                  │ │
│  │  GitHub URL:       │                                  │ │
│  │  [           ]     │                                  │ │
│  │                     │                                  │ │
│  │  ☑ Featured        │                                  │ │
│  │                     │                                  │ │
│  │  [Create Project]  │                                  │ │
│  │                     │                                  │ │
│  └─────────────────────┴──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ User fills form
                              │ Clicks "Create Project"
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   PROJECT SAVED TO SUPABASE                  │
│                                                              │
│  1. Data saved to PostgreSQL database                       │
│  2. Image uploaded to Supabase Storage                      │
│  3. Public URL generated                                    │
│  4. Success message shown                                   │
│  5. Project list refreshed                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ User closes admin panel
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              PROJECT APPEARS ON PORTFOLIO                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ⚫ ⚫ ⚫  new-project.tsx                  ⭐ Featured  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │                                                   │ │ │
│  │  │         [PROJECT IMAGE FROM SUPABASE]            │ │ │
│  │  │                                                   │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                         │ │
│  │  New Project                                           │ │
│  │  This is my latest project...                         │ │
│  │                                                         │ │
│  │  Tech Stack:                                           │ │
│  │  [React] [Next.js] [Tailwind]                         │ │
│  │                                                         │ │
│  │  [$ view --live]  [$ git clone]                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ← Scroll horizontally to see more projects →              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐
│   Browser    │
│  (Ctrl+K)    │
└──────┬───────┘
       │
       │ 1. Opens MiniTerminal
       ↓
┌──────────────┐
│ MiniTerminal │◄────── Enter secret code: "az8576"
└──────┬───────┘
       │
       │ 2. Validates code
       │ 3. Opens AdminPanel
       ↓
┌──────────────┐
│  AdminPanel  │
└──────┬───────┘
       │
       │ 4. User fills form
       │ 5. Uploads image
       │ 6. Clicks submit
       ↓
┌──────────────┐
│   Supabase   │
│              │
│ ┌──────────┐ │
│ │ Database │ │◄─── Project data
│ └──────────┘ │
│              │
│ ┌──────────┐ │
│ │ Storage  │ │◄─── Image upload
│ └──────────┘ │
└──────┬───────┘
       │
       │ 7. Returns success
       ↓
┌──────────────┐
│  AdminPanel  │
└──────┬───────┘
       │
       │ 8. Refreshes project list
       │ 9. Shows success message
       ↓
┌──────────────┐
│ProjectSection│◄─── Auto-fetches from Supabase
└──────────────┘
       │
       │ 10. Displays on portfolio
       ↓
┌──────────────┐
│    Users     │
│  see new     │
│  project!    │
└──────────────┘
```

## File Structure & Connections

```
app/layout.tsx
  └─► GlobalTerminalShortcut
       ├─► MiniTerminal
       │    └─► validates secret code
       │         └─► triggers onAuthenticated()
       │
       └─► AdminPanel
            ├─► Supabase Client (/lib/supabase.ts)
            │    ├─► Database (projects table)
            │    └─► Storage (project-images bucket)
            │
            └─► Form Actions
                 ├─► Create Project
                 ├─► Update Project
                 └─► Delete Project

components/sections/ProjectsSection.tsx
  └─► Supabase Client (/lib/supabase.ts)
       └─► Fetches projects
            └─► Displays in gallery
```

## Environment Variables Flow

```
.env.local (NEVER COMMIT!)
  │
  ├─► NEXT_PUBLIC_SUPABASE_URL
  │    └─► Used by: /lib/supabase.ts
  │         └─► Creates Supabase client
  │
  ├─► NEXT_PUBLIC_SUPABASE_ANON_KEY
  │    └─► Used by: /lib/supabase.ts
  │         └─► Public API key (safe for client)
  │
  └─► NEXT_PUBLIC_ADMIN_SECRET
       └─► Used by: MiniTerminal
            └─► Validates admin access
```

## Security Layers

```
Layer 1: Secret Code
  └─► User must know "az8576"
       │
       ↓
Layer 2: Environment Variable
  └─► Code stored in NEXT_PUBLIC_ADMIN_SECRET
       │
       ↓
Layer 3: Supabase Anon Key
  └─► Public key with limited permissions
       │
       ↓
Layer 4: Row Level Security (Optional)
  └─► Database-level access control
       │
       ↓
Layer 5: Storage Policies
  └─► File upload restrictions
```

## User Journey

### Admin User
```
Visit Portfolio
  ↓
Press Ctrl+K
  ↓
Enter "az8576"
  ↓
Admin Panel Opens
  ↓
Add/Edit/Delete Projects
  ↓
Changes Saved to Supabase
  ↓
See Changes Live!
```

### Regular Visitor
```
Visit Portfolio
  ↓
Scroll through Projects
  ↓
See Real-Time Data from Supabase
  ↓
Click Project Links
  ↓
View Demos & GitHub Repos
```

## Component Hierarchy

```
RootLayout
│
├── GlobalTerminalShortcut
│   │
│   ├── MiniTerminal (z-index: 70)
│   │   ├── Terminal Header (○ ○ ○)
│   │   ├── Output Area
│   │   ├── Input Line
│   │   └── Help Text
│   │
│   └── AdminPanel (z-index: 90)
│       ├── Panel Header (○ ○ ○)
│       ├── Form Column
│       │   ├── Text Inputs
│       │   ├── Image Upload
│       │   ├── Checkboxes
│       │   └── Submit Button
│       │
│       └── Projects List Column
│           ├── Project Card 1
│           ├── Project Card 2
│           └── ...
│
└── Navigation (z-index: 50)
    └── TerminalMenu (z-index: 50)
```

## State Management

```
GlobalTerminalShortcut
  │
  ├── [isMiniTerminalOpen, setIsMiniTerminalOpen]
  │    └─► Controls MiniTerminal visibility
  │
  └── [isAdminPanelOpen, setIsAdminPanelOpen]
       └─► Controls AdminPanel visibility

AdminPanel
  │
  ├── [projects, setProjects]
  │    └─► Loaded from Supabase
  │
  ├── [formData, setFormData]
  │    └─► Current form state
  │
  ├── [editingProject, setEditingProject]
  │    └─► Project being edited
  │
  └── [uploadingImage, setUploadingImage]
       └─► Image upload status

ProjectsSection
  │
  ├── [projects, setProjects]
  │    └─► Loaded from Supabase
  │
  └── [isLoading, setIsLoading]
       └─► Loading state
```

---

**Visual guides help understanding the flow!**
Refer to this document when understanding how components interact.
