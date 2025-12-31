# Metaflow Architecture - Complete Technical Reference

## Overview

Metaflow is a **declarative workflow automation platform** where business logic lives in configuration (JSON), not code. It enables defining data models visually, configuring actions declaratively, and executing workflows transactionally in PostgreSQL.

**Core Philosophy**: Push complexity to the database. 1300+ lines of PL/pgSQL handle action execution, criteria evaluation, and relationship traversal atomically.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    METAFLOW                                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │                              FRONTEND (Next.js)                               │   │
│  ├──────────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                               │   │
│  │  /ontology              /workspace              /actions          /processes  │   │
│  │  ┌─────────────┐        ┌─────────────┐        ┌──────────┐      ┌─────────┐ │   │
│  │  │ObjectType   │        │SmartAction  │        │Action    │      │Process  │ │   │
│  │  │ConfigForm   │        │Dropdown     │        │Builder   │      │Canvas   │ │   │
│  │  │ObjectForm   │        │Execution    │        │Criteria  │      │ReactFlow│ │   │
│  │  │Relationship │        │Modal        │        │Builder   │      │StateNode│ │   │
│  │  │Visualization│        │StatusBread  │        │RuleConf  │      │ActionNod│ │   │
│  │  └─────────────┘        └─────────────┘        └──────────┘      └─────────┘ │   │
│  │         │                      │                     │                │       │   │
│  │         └──────────────────────┼─────────────────────┼────────────────┘       │   │
│  │                                ▼                     ▼                        │   │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐ │   │
│  │  │                         HOOKS & QUERIES                                  │ │   │
│  │  │  useObjectTypes  useObjects  useActions  useAvailableActionsForObject   │ │   │
│  │  │  useRelationships  useProcessLayouts  useLayoutedElements               │ │   │
│  │  └─────────────────────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                          │                                           │
│                                          ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │                              SUPABASE RPC                                     │   │
│  │  execute_action()  evaluate_submission_criteria()  get_available_actions()   │   │
│  │  generate_semantic_id()  validate_action_parameters()  list_actions()        │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                          │                                           │
│                                          ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │                           POSTGRESQL (metaflow.*)                             │   │
│  ├──────────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                               │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │   │
│  │  │   tenants   │    │object_types │    │   objects   │    │relationships│   │   │
│  │  │             │◄───│   (JSONB    │◄───│   (JSONB    │    │ (1:N, M:N)  │   │   │
│  │  │  multi-     │    │   config)   │    │    data)    │    │             │   │   │
│  │  │  tenant     │    └─────────────┘    └─────────────┘    └─────────────┘   │   │
│  │  └─────────────┘           │                  │                  │          │   │
│  │                            ▼                  ▼                  ▼          │   │
│  │  ┌─────────────┐    ┌─────────────────────────────────────────────────────┐ │   │
│  │  │action_types │    │                  PL/pgSQL ENGINE                     │ │   │
│  │  │  (JSONB     │───▶│  ┌─────────────────────────────────────────────┐    │ │   │
│  │  │   config)   │    │  │ evaluate_submission_criteria()              │    │ │   │
│  │  │             │    │  │   └─► evaluate_expression() [recursive]     │    │ │   │
│  │  │ parameters  │    │  │         └─► evaluate_comparison()           │    │ │   │
│  │  │ rules       │    │  │               └─► build_property_path_sql() │    │ │   │
│  │  │ criteria    │    │  │               └─► build_m2n_exists_sql()    │    │ │   │
│  │  └─────────────┘    │  └─────────────────────────────────────────────┘    │ │   │
│  │                     │  ┌─────────────────────────────────────────────┐    │ │   │
│  │  ┌─────────────┐    │  │ execute_action()                            │    │ │   │
│  │  │process_     │    │  │   └─► validate_action_parameters()          │    │ │   │
│  │  │layouts      │    │  │   └─► evaluate_submission_criteria()        │    │ │   │
│  │  │             │    │  │   └─► execute rules (modify/create/delete)  │    │ │   │
│  │  │ trackedPick │    │  └─────────────────────────────────────────────┘    │ │   │
│  │  │ layoutData  │    └─────────────────────────────────────────────────────┘ │   │
│  │  └─────────────┘                                                            │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Database Schema

### Core Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `tenants` | Multi-tenant isolation | id, name, slug |
| `object_types` | Schema definitions | id, tenant_id, display_name, **config (JSONB)** |
| `objects` | Data instances | id, tenant_id, object_type_id, semantic_id, **data (JSONB)** |
| `relationships` | Type connections | cardinality (1:N, N:1, M:N), source/target, junction_object_type_id |
| `action_types` | Workflow definitions | id, tenant_id, display_name, **config (JSONB)** |
| `process_layouts` | State machine canvas | object_type_ids[], tracked_picklists[], layout_data |
| `ontology_layouts` | Graph visualization | node_positions (JSONB) |

### JSONB Structures

**ObjectType Config:**
```json
{
  "properties": {
    "status": {
      "displayName": "Status",
      "type": "string",
      "required": true,
      "picklistConfig": {
        "options": ["Pending", "Approved", "Rejected"]
      }
    },
    "customer": {
      "type": "object-reference",
      "referenceConfig": { "objectTypeId": "uuid" }
    }
  },
  "titleKey": "name",
  "primaryKey": "id"
}
```

**ActionType Config:**
```json
{
  "executionType": "declarative",
  "parameters": [...],
  "rules": [...],
  "submissionCriteria": [...],
  "description": "..."
}
```

---

## 2. Ontology System

### Data Model Hierarchy

```
Tenant
  └── ObjectTypes (schema definitions)
        ├── Properties (fields with types)
        │     ├── string (with validation, picklists)
        │     ├── number (with min/max)
        │     ├── boolean
        │     ├── timestamp
        │     └── object-reference (FK to other types)
        │
        ├── Relationships
        │     ├── ONE_TO_MANY (property_name on source)
        │     ├── MANY_TO_ONE (property_name on target)
        │     └── MANY_TO_MANY (junction table auto-created)
        │
        └── Objects (instances with JSONB data)
              └── semantic_id: "customer-01" (auto-generated)
```

### Key Frontend Components

| Component | File | Purpose |
|-----------|------|---------|
| ObjectTypeConfigForm | ontology/ObjectTypeConfigForm.tsx | Define properties, types, validation |
| ObjectForm | ontology/ObjectForm.tsx | Create/edit object instances |
| ObjectsTable | ontology/ObjectsTable.tsx | Display objects with FK resolution |
| OntologyVisualization | visualization/OntologyVisualization.tsx | ReactFlow graph of types |

---

## 3. Actions Engine (Core Innovation)

### Execution Types

1. **Declarative** - Rules defined in JSON, executed by PL/pgSQL
2. **Function-backed** - Delegates to custom PL/pgSQL function

### Rule Types

| Rule | Purpose | Example |
|------|---------|---------|
| `modify_object` | Update properties | Change status to "Approved" |
| `create_object` | Insert new object | Create invoice from order |
| `delete_object` | Remove object | Archive completed items |
| `link_objects` | Create relationship | Connect order to customer |

### Property Value Sources

```typescript
{
  source: 'static' | 'parameter' | 'current_user' | 'current_timestamp' | 'object_property',
  value?: any,           // for static
  parameterName?: string // for parameter
}
```

---

## 4. Submission Criteria System (Most Complex)

### Expression Tree Structure

```
Expression
  ├── ComparisonExpression
  │     ├── left: property | parameter | system | static
  │     ├── operator: = | != | > | >= | < | <= | LIKE | NULL | ...
  │     └── right: static | parameter
  │
  └── LogicalExpression
        ├── operator: AND | OR | NOT
        └── expressions: Expression[] (recursive)
```

### Property Path Traversal

Supports deep relationship traversal:

```
order.customer.status = 'active'
  │      │        │
  │      │        └── Terminal property
  │      └── M:1 relationship traversal
  └── Base parameter
```

**Generated SQL (M:1):**
```sql
(SELECT j0.status::VARCHAR
 FROM order_view AS base
 JOIN customer_view AS j0 ON base.customer_id::UUID = j0.id
 WHERE base.id = 'order-uuid')
```

### M:N Relationship Handling

Uses EXISTS with quantifiers:

- **ANY**: At least one related object matches
- **ALL**: All related objects must match (implemented via NOT EXISTS with flipped condition)

**Generated SQL (ANY):**
```sql
EXISTS (
  SELECT 1 FROM metaflow.relations r
  JOIN order_view AS target ON target.id = r.target_id
  WHERE r.source_id = 'customer-id'
  AND target.amount::NUMERIC > 1000
)
```

### Evaluation Flow

```
evaluate_submission_criteria(expression, parameters, tenant_id)
  │
  ├── If logical: evaluate_expression() [recursive]
  │     ├── AND: short-circuit on first FALSE
  │     ├── OR: short-circuit on first TRUE
  │     └── NOT: flip result
  │
  └── If comparison: evaluate_comparison()
        ├── Resolve left operand (property path → SQL)
        ├── Resolve right operand (static/parameter)
        ├── Detect M:N marker → build_m2n_exists_sql()
        └── Execute comparison, return { passed, trace }
```

---

## 5. Action Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ACTION EXECUTION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Frontend                                                                    │
│  ────────                                                                    │
│  1. User clicks action button (SmartActionDropdown)                         │
│  2. ActionExecutionModal opens with parameter form                          │
│  3. First param pre-filled with current object ID                           │
│  4. User fills remaining parameters                                         │
│  5. Click "Execute"                                                         │
│                                                                              │
│                              ▼                                               │
│                                                                              │
│  API Layer                                                                   │
│  ─────────                                                                   │
│  6. executeAction(actionTypeId, tenantId, parameters, currentUser)          │
│  7. supabase.rpc('execute_action', { p_action_type_id, p_tenant_id, ... })  │
│                                                                              │
│                              ▼                                               │
│                                                                              │
│  Database (PL/pgSQL)                                                         │
│  ───────────────────                                                         │
│  8.  Fetch action config from action_types                                   │
│  9.  validate_action_parameters() → check required, types, references        │
│  10. evaluate_submission_criteria() → recursive expression evaluation        │
│      └── If FALSE → return { success: false, error: "Criteria not met" }    │
│  11. For each rule in config.rules:                                          │
│      ├── modify_object → UPDATE objects SET data = data || new_values       │
│      ├── create_object → INSERT INTO objects (with semantic_id gen)         │
│      ├── delete_object → DELETE FROM objects                                │
│      └── On failure → stop, return error                                     │
│  12. Return { success: true, results: [...] }                                │
│                                                                              │
│                              ▼                                               │
│                                                                              │
│  Frontend Response                                                           │
│  ─────────────────                                                           │
│  13. Show success checkmark (1.5s)                                           │
│  14. Close modal                                                             │
│  15. Trigger refetch (router.refresh, data hooks)                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Smart Action Filtering

### Classification System

| Classification | Criteria | Priority Score |
|---------------|----------|----------------|
| **Recommended** | Has criteria AND matches current state | 200 |
| **Independent** | No criteria defined | 150 |
| **Transition** | State-change action | 100 |
| **Conditional** | Has criteria but doesn't match | 50 |
| **Unavailable** | Criteria evaluation failed | 0 (hidden) |

### get_available_actions_for_object()

Returns actions that reference the object type in:
1. Parameters (as object-reference)
2. Rules (modify/create/delete target)
3. Submission criteria (property path base)

Ordered by: priority_score DESC, display_name ASC

---

## 7. Process Canvas (State Machines)

### State Node Generation

```typescript
generateStateNodes(objectTypes, trackedPicklists)
  │
  └── For each objectType with picklist properties in trackedPicklists:
        └── For each picklist option:
              └── Create node: "state::OrderType::Approved"
```

### Action Classification

```typescript
classifyAction(action, objectTypes)
  │
  ├── Find source state (from submissionCriteria: status = 'Pending')
  ├── Find target state (from rules: modify status to 'Approved')
  │
  └── Result:
        ├── state_transition: Draw edge between nodes
        ├── orphaned: State value doesn't exist in picklist
        └── regular: Not a state-related action
```

### Auto-Create Transition Actions

When user draws edge from "Pending" to "Approved":

```json
{
  "displayName": "Pending → Approved",
  "parameters": [{ "name": "order", "type": "object-reference" }],
  "submissionCriteria": [{ "left": "order.status", "op": "=", "right": "Pending" }],
  "rules": [{ "type": "modify_object", "properties": { "status": "Approved" } }]
}
```

---

## 8. Key PL/pgSQL Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `execute_action` | 200+ | Main entry point for action execution |
| `evaluate_submission_criteria` | 100+ | Recursive expression evaluation |
| `evaluate_expression` | 150+ | AND/OR/NOT logic with short-circuit |
| `evaluate_comparison` | 100+ | Property path resolution + comparison |
| `build_property_path_sql` | 200+ | Dynamic SQL for relationship traversal |
| `build_m2n_exists_sql` | 100+ | EXISTS queries for M:N with ANY/ALL |
| `get_available_actions_for_object` | 100+ | Smart action filtering |
| `generate_semantic_id` | 50+ | Human-readable ID generation |
| `validate_action_parameters` | 50+ | Parameter type/required validation |

---

## 9. Frontend Architecture

### Route Structure

```
/metaflow
  ├── /ontology          # Object type management
  │     ├── /new         # Create type
  │     ├── /[id]        # Edit type config
  │     ├── /[id]/data   # View objects
  │     ├── /relationships
  │     └── /visualization
  │
  ├── /workspace         # Object instance management
  │     ├── /[typeId]    # Objects list
  │     └── /[typeId]/[objectId]  # Object detail + actions
  │
  ├── /actions           # Action management
  │     ├── /new         # Create action
  │     └── /[id]        # Edit action
  │
  ├── /processes         # Workflow canvases
  │     └── /[id]        # Process builder
  │
  └── /dashboard
```

### State Management Pattern

- **Hooks + useState** for local state
- **Supabase queries** for data fetching
- **RPC calls** for complex operations
- **Refs** in ProcessCanvas to avoid re-renders
- **useTenant()** context for tenant scoping

---

## 10. Key Design Patterns

### 1. JSONB-First Storage
Properties defined in config, not database columns. Trades SQL type safety for schema flexibility.

### 2. Database-Centric Logic
Business logic in PL/pgSQL functions. Guarantees atomicity, simplifies application code.

### 3. Recursive Expression Trees
Criteria are nested JSON structures. Enables arbitrary boolean logic without custom code.

### 4. Dynamic SQL Generation
Property paths compiled to SQL with proper type casting and relationship joins.

### 5. Short-Circuit Evaluation
AND stops on first FALSE, OR stops on first TRUE. Optimizes complex criteria.

### 6. Priority-Based Filtering
Actions ranked by classification. UI shows most relevant actions first.

### 7. Multi-Tenant by Convention
All queries filter by tenant_id. Application responsible (RLS not implemented).

---

## File Reference

### Database (1300+ lines PL/pgSQL)
- `supabase/schemas/03_metaflow/01_schema.sql` - Schema creation
- `supabase/schemas/03_metaflow/02_tables.sql` - Tables (172 lines)
- `supabase/schemas/03_metaflow/03_functions.sql` - Functions (1300+ lines)

### Frontend
- `src/app/(protected)/metaflow/lib/types/ontology.ts` - Core type definitions
- `src/app/(protected)/metaflow/lib/types/actions.ts` - Action/criteria types
- `src/app/(protected)/metaflow/lib/queries/*.ts` - Supabase queries
- `src/app/(protected)/metaflow/lib/hooks/*.ts` - React hooks
- `src/app/(protected)/metaflow/lib/process/*.ts` - State machine utilities
- `src/app/(protected)/metaflow/components/**/*.tsx` - UI components

---

## Summary

Metaflow is a **low-code workflow platform** with:

1. **Visual ontology builder** - Define data models with custom fields and relationships
2. **Declarative actions engine** - Configure business logic in JSON, execute in PostgreSQL
3. **Complex criteria evaluation** - Property path traversal with M:N quantifiers
4. **State machine visualization** - ReactFlow canvas with auto-generated transitions
5. **Smart action filtering** - Context-aware action recommendations

The architecture pushes complexity to the database layer, where 1300+ lines of PL/pgSQL handle action execution, criteria evaluation, and relationship traversal atomically.
