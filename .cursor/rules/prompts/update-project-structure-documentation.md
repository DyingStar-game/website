# Update Project Structure Documentation

## Purpose

This prompt provides comprehensive instructions for updating the complete Project Structure Documentation of the DyingStar repository. Use this when the repository structure has changed significantly or when documentation needs to be refreshed.

## Target Files

The following files must be updated:

1. `Documentation/Guidelines/architecture/FolderStructure.md` - High-level architecture overview
2. `Documentation/Guidelines/architecture/ProjectTreeFolder.md` - Complete file tree documentation
3. `Documentation/Guidelines/architecture/FileTypes.md` - File naming conventions (update if new patterns emerge)
4. `Documentation/Guidelines/architecture/Architecture.md` - Reference links (usually no changes needed)

---

## Prerequisites

Before starting, ensure you have:

- Full context of the repository structure
- Access to all directories and files
- Understanding of Next.js 15 App Router architecture
- Knowledge of the project's tech stack

---

## Step-by-Step Instructions

### Phase 1: Reconnaissance - Explore the Repository

#### 1.1 Scan Root Directory

```
List and document:
- Configuration files (.nvmrc, .prettierrc, eslint.config.mjs, etc.)
- Package management files (package.json, pnpm-lock.yaml)
- Build & deployment files (Makefile, middleware.ts, docker/, etc.)
- Documentation files (README.md, LICENSE)
```

#### 1.2 Scan app/ Directory (Next.js App Router)

```
Recursively explore:
- app/ root level files (layout.tsx, error.tsx, sitemap.tsx, etc.)
- app/[locale]/ structure
  - Route groups: (landing), (layout), (logged-in)
  - Parallel routes: @modal
  - Dynamic routes: docs/[slug]
  - Special files: globals.css, providers.tsx, manifest.ts
- For each route segment, document:
  - page.tsx
  - layout.tsx
  - loading.tsx
  - error.tsx
  - not-found.tsx
  - _components/ folders
```

#### 1.3 Scan src/ Directory (Application Code)

```
Explore and categorize:
- src/components/
  - DS/ (Design System components)
  - ui/ (shadcn/ui primitives)
  - svg/ (SVG components)
  - utils/ (Component utilities)
  
- src/features/ (Vertical slices)
  - List each feature folder
  - Document file patterns (*.tsx, *.type.ts, *.hook.ts, etc.)
  
- src/hooks/ (Cross-cutting hooks)
  - List all hook files
  
- src/i18n/ (Internationalization)
  - config.ts, routing.ts, navigation.ts, request.ts
  
- src/lib/ (Libraries & utilities)
  - actions/
  - env/
  - errors/
  - format/
  - Individual utility files
  
- src/types/ (Global types)

- Root level src/ files (middleware.ts, site-config.ts)
```

#### 1.4 Scan content/ Directory

```
Document:
- content/news/en/ - English articles
- content/news/fr/ - French articles
- Any other content folders
```

#### 1.5 Scan public/ Directory

```
List:
- public/images/
- public/assets/
- Root level SVG/PNG files
```

#### 1.6 Scan messages/ Directory

```
Document:
- Translation files (en.json, fr.json, etc.)
```

#### 1.7 Scan docker/ & Documentation/ Directories

```
Docker:
- Dockerfile.dev
- Dockerfile.prod
- docker-compose.yml

Documentation:
- Guidelines/architecture/
- Guidelines/ (process docs)
- Guidelines/pictures/
```

---

### Phase 2: Update FolderStructure.md

**File:** `Documentation/Guidelines/architecture/FolderStructure.md`

**Structure:**

```markdown
# Folder Structure

[Introduction paragraph about Next.js 15 App Router architecture]

## Global Structure

[ASCII tree showing top-level folders with brief descriptions]

## 📁 `app/` - Next.js App Router

[Description]
[ASCII tree of app/ structure]
[Key Concepts section]

## 📁 `src/` - Application source code

[Description]
[ASCII tree of src/ structure]
[Feature-based architecture explanation]

## 📁 `content/` - Editorial content

[Description and purpose]

## 📁 `public/` - Static assets

[Description and access pattern]

## 📁 `messages/` - i18n translations

[Description, structure, and usage example]

## 📁 `docker/` - Containerization

[Description and file listing]

## 📁 `Documentation/` - Internal documentation

[Description and structure]

## TypeScript path aliases

[Configuration from tsconfig.json with usage examples]

## File naming conventions

[Quick reference with links to FileTypes.md]

## References

[Links to Next.js docs and other internal docs]
```

**Key Requirements:**

- Use emojis (📁) for main sections
- Keep ASCII trees clean and aligned
- Include brief but clear descriptions
- Limit depth to 2-3 levels maximum
- Focus on HIGH-LEVEL overview, not every file

**Format Example:**

```
## 📁 `app/` - Next.js App Router

Handles **routing**, **layouts**, and **entry points** of the application following Next.js 15 conventions.

```
app/
├── 📁 [locale]/               # Internationalized routes (en, fr, etc.)
│   ├── 📁 (layout)/           # Route group - Static pages
│   │   └── 📁 pageName/       # Page folder
│   ├── 📁 @modal/             # Parallel route - Modal system
│   └── 📁 docs/               # User documentation
```

**Key Concepts:**
- **Route Groups** `(name)`: Organize without affecting URL
- **Parallel Routes** `@modal`: Display multiple pages simultaneously
```

---

### Phase 3: Update ProjectTreeFolder.md

**File:** `Documentation/Guidelines/architecture/ProjectTreeFolder.md`

**Structure:**

```markdown
# Project Tree - Complete File Structure

[Introduction and link to FolderStructure.md]

---

## 📂 Root Directory

### Configuration Files
[Bullet list of ALL config files with descriptions]

### Package Management
[package.json, pnpm-lock.yaml with descriptions]

### Build & Development
[Makefile, middleware.ts with descriptions]

### Documentation & Legal
[README.md, LICENSE with descriptions]

---

## 📂 app/ — Next.js App Router

[Detailed explanation of routing layer]

### Root Level (app/)
[ASCII tree with ALL files and descriptions]

### Internationalized Routes (app/[locale]/)
[Complete ASCII tree showing EVERY route segment and file]

**Key Concepts:**
[Explanations of route groups, parallel routes, etc.]

---

## 📂 src/ — Application Source Code

[Introduction]

### src/components/ — Reusable UI Components
[Complete tree showing DS/, ui/, svg/, utils/ with ALL files]

### src/features/ — Business Features
[Complete tree showing each feature folder with its files]

### src/hooks/ — Cross-cutting React Hooks
[List all hook files]

### src/i18n/ — Internationalization Configuration
[List all i18n files]

### src/lib/ — Libraries and Utilities
[Complete tree with all subdirectories and files]

### src/types/ — Global TypeScript Types
[List type files]

### Other src/ Files
[middleware.ts, site-config.ts]

---

## 📂 content/ — Editorial Content

[Structure and explanation of MDX organization]

---

## 📂 public/ — Static Assets

[Complete listing with explanations]

---

## 📂 messages/ — i18n Translation Dictionaries

[Structure, JSON format example, usage example]

---

## 📂 docker/ — Containerization

[List all Docker files]

---

## 📂 Documentation/ — Internal Documentation

[Complete tree of all documentation files]

---

## 🔄 Data Flow Examples

### News Pipeline
[Diagram showing data flow]

### Component Import Flow
[Diagram showing component hierarchy]

### i18n Flow
[Diagram showing internationalization flow]

---

## 📝 Notes

[Important notes about path aliases, file types, auto-generated files]

---

## 🔗 References

[Links to related documentation]
```

**Key Requirements:**

- EXHAUSTIVE listing of ALL important files
- Use emojis for major sections (📂, 🔄, 📝, 🔗)
- Group files logically (config, package management, etc.)
- Include clear descriptions for each file/folder
- Add data flow diagrams
- Keep ASCII trees properly formatted
- List shadcn/ui components completely

**Format Example:**

```
### src/components/ui/ — shadcn/ui primitives

```
src/components/ui/
├── accordion.tsx
├── alert.tsx
├── alert-dialog.tsx
├── button.tsx
├── card.tsx
├── dialog.tsx
├── form.tsx
├── input.tsx
└── ...
```

[Continue with complete list]
```

---

### Phase 4: Review and Update FileTypes.md (if needed)

**File:** `Documentation/Guidelines/architecture/FileTypes.md`

**When to Update:**

Only update if you discover:
- New file type patterns (e.g., `*.service.ts`, `*.util.ts`)
- Changes to existing patterns
- New conventions being used

**What to Update:**

1. File Type Reference table
2. Add new detailed explanation section
3. Update examples if patterns changed

**What NOT to Change:**

- Existing well-documented patterns
- The overall structure of the document
- Examples that are still valid

---

### Phase 5: Verify Architecture.md

**File:** `Documentation/Guidelines/architecture/Architecture.md`

**Check:**

- Section "Project Structure Documentation" exists
- Links to FolderStructure.md, ProjectTreeFolder.md, FileTypes.md are correct
- No duplication of content

**Expected Structure:**

```markdown
## Project Structure Documentation

The project structure is documented in multiple files for better organization:

- **[FolderStructure.md](./FolderStructure.md)** — High-level architecture overview, key concepts, and folder organization
- **[ProjectTreeFolder.md](./ProjectTreeFolder.md)** — Complete file-by-file breakdown of the entire repository
- **[FileTypes.md](./FileTypes.md)** — Detailed file naming conventions and patterns
```

---

## Quality Checklist

After completing all updates, verify:

### Content Accuracy

- [ ] All directories accurately documented
- [ ] No missing important files
- [ ] All paths are correct
- [ ] File descriptions are accurate

### Formatting

- [ ] ASCII trees are properly aligned
- [ ] Markdown rendering is correct
- [ ] Code blocks use correct syntax highlighting
- [ ] Emojis are used consistently

### Completeness

- [ ] FolderStructure.md covers all major folders
- [ ] ProjectTreeFolder.md lists all important files
- [ ] FileTypes.md documents all file patterns
- [ ] Architecture.md links are correct

### Readability

- [ ] Human-friendly language
- [ ] Clear hierarchical structure
- [ ] Logical grouping of information
- [ ] Not overly verbose

### Cross-references

- [ ] Links between documents work
- [ ] References to Next.js docs are valid
- [ ] Internal links are correct

---

## Common Pitfalls to Avoid

1. **Too Much Detail in FolderStructure.md**
   - Keep it high-level
   - Don't list every single file
   - Focus on architecture overview

2. **Missing Files in ProjectTreeFolder.md**
   - Be thorough
   - Check all subdirectories
   - Don't skip "boring" config files

3. **Outdated Examples**
   - Verify code examples actually exist in repo
   - Update import paths if changed
   - Check that patterns are still in use

4. **Broken Links**
   - Test all markdown links
   - Verify file paths
   - Check external links

5. **Inconsistent Formatting**
   - Use same emoji style throughout
   - Keep ASCII tree alignment consistent
   - Follow markdown conventions

6. **Forgetting Data Flows**
   - Update data flow diagrams in ProjectTreeFolder.md
   - Ensure they reflect current architecture
   - Add new flows if patterns emerged

---

## Tips for Efficiency

1. **Use Tools**
   - Use `list_dir` extensively
   - Use `glob_file_search` for finding file patterns
   - Read actual files to verify content

2. **Work Systematically**
   - Complete Phase 1 fully before moving to Phase 2
   - Don't skip the reconnaissance phase
   - Document as you explore

3. **Maintain Context**
   - Keep track of what you've documented
   - Note any inconsistencies found
   - Mark areas that need clarification

4. **Stay Organized**
   - Update one file at a time
   - Complete each section before moving on
   - Test your changes

---

## Final Notes

- This is COMPREHENSIVE documentation work
- Expect 100-200+ tool calls for complete update
- Take your time to be thorough
- The goal is to create documentation that truly reflects the repository
- Humans should be able to understand the project structure just by reading these docs
- When in doubt, BE MORE DETAILED rather than less

**Remember:** This documentation is critical for onboarding, maintenance, and project understanding. Quality matters more than speed.

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Maintained By:** DyingStar Development Team

