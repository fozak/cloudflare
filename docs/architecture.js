//TODO


// RBAC 

async checkPermission(run_doc)  
//before start
run_doc.operation is resolved
run_doc.query is resolved
run_doc.user is resolved from jwt

so we can push to db pipeline the query 
(initial query from run() + additional filter  const userRoles = user._allowed_read || []; // User's capabilities
    
    // Check against record's ACL
    if (operation === "write" || operation === "update" || operation === "delete") {
      const allowed = record._allowed || [];
      return userRoles.some(role => allowed.includes(role));
    }
    
    if (operation === "read") {
      const allowed = record._allowed || [];
      const allowedRead = record._allowed_read || [];
      return userRoles.some(role => 
        allowed.includes(role) || allowedRead.includes(role)
      );
    })


//run_doc context

const run_doc = {
          // Frappe standard fields
          doctype: "Run",  //own context
          name: generateId("run"), //own context
          creation: start, //own context
          modified: start, //own context
          operation_key: JSON.stringify(op),    //added operation_key
          modified_by: resolved.owner || "system", //own context
          docstatus: 0, //own context 
          owner: resolved.owner || "system",  // after run_doc.user resolved

          //compatibility with univeral doctype like Adapter
          config: op.config || {}, // ADDED config
          functions: op.functions || {}, // ADDED functions

          // Operation definition
          operation: resolved.operation,
          operation_original: op.operation,
          source: op.source || null, // ADDED use this for mutations of original + input
          source_doctype: resolved.source_doctype,
          target: op.target || null, // ADDED use this instead target
          target_doctype: resolved.target_doctype,

          // UI/Rendering (explicit takes priority over resolved)
          view: "view" in op ? op.view : resolved.view,
          component: "component" in op ? op.component : resolved.component,
          container: "container" in op ? op.container : resolved.container,

          // DATA - Delta architecture
          query: op.query || {},
          input: op.input || {},
          target: null,

          // Execution state
          _state: {}, //ADDED state, changed to _state
          status: "running",
          success: false,
          error: null,
          duration: 0,

          // Hierarchy
          parent_run_id: mergedOptions.parentRunId || null,
          child_run_ids: [],

          // Flow context
          flow_id: op.flow_id || null,
          flow_template: op.flow_template || null,
          step_id: op.step_id || null,
          step_title: op.step_title || null,

          // Authorization
          user: {
            name:     // this is userId used as id
            email:
            _allowed_read: [],  // User's capabilities  
            _state:

          }    //changed from agent:

          // Options
          options: mergedOptions,

          // Runtime helpers
          child: null,
        };
* refactor to use docname as semantic name and name as technical name

// staate/CW

CW.Adapter.adapterq8i39mys



user:

main:
password TEXT,        -- hashed password for user authentication
tokenKey TEXT,        -- per-user secret used internally to sign JWTs and invalidate sessions; never exposed to clients
verified INTEGER,     -- 0 or 1; indicates whether the user's email is verified
emailVisibility INTEGER -- 0 or 1; controls whether the user's email is publicly visible (privacy flag)


{
  "user_auth_methods": {
    "identity_password": true,   // Maps to "Identity/Password" (Enabled)
    "oauth2": false,             // Maps to "OAuth2" (Disabled)
    "otp": false,                // Maps to "One-time password (OTP)" (Disabled)
    "mfa": false                 // Maps to "Multi-factor authentication (MFA)" (Disabled)
  }
}


add to auth adapter config flattened 
{
  "auth": {
    "tokens": {
      "auth_duration_seconds": null,          // Maps to "Auth duration (in seconds)"
      "email_verification_duration_seconds": null, // Maps to "Email verification duration (in seconds)"
      "password_reset_duration_seconds": null, // Maps to "Password reset duration (in seconds)"
      "email_change_duration_seconds": null,  // Maps to "Email change duration (in seconds)"
      "protected_file_access_duration_seconds": null // Maps to "Protected file access duration (in seconds)"
    },
    "invalidate_all_previous_tokens": false   // Global toggle if links are clicked
  }
}
{
  "auth": {
    "email_templates": {
      "default_verification_email": null,        // Maps to "Default Verification email template"
      "default_password_reset_email": null,      // Maps to "Default Password reset email template"
      "default_confirm_email_change_email": null,// Maps to "Default Confirm email change email template"
      "default_otp_email": null,                 // Maps to "Default OTP email template"
      "default_login_alert_email": null          // Maps to "Default Login alert email template"
    }
  }
}




//considered types of "active schemas/adapters"

// The most flexible - Adapter with config, functions, scripts (and compilation of in in CW)
// Schema is yet missing - if Adapter needs it, if case type (like non-pipeline functions)
// this is just like precompiled library

Perfect! PocketBase SDK is loaded correctly:
✅ SDK loaded:
javascriptglobalThis.PocketBase  // → class Client{...}  ✅
✅ Adapter compiled with runtime functions:
javascriptCW.getDocument('Adapter', 'adapterb7l0z4ur')
// → {config: {...}, init: ƒ, select: ƒ, insert: ƒ, update: ƒ, delete: ƒ}  ✅
✅ Config present:
javascriptconfig: {
  url: 'http://143.198.29.88:8090/', 
  autoCancellation: false, 
  defaultCollection: 'item'
}  ✅
Everything is working! Your compilation system:

Loaded the PocketBase SDK script → globalThis.PocketBase
Compiled the adapter functions → init, select, insert, update, delete
Stored config → accessible via this.config in functions

Ready to use:
javascriptawait CW.Adapter.pocketbase.select(run_doc);
// or
await CW.Adapter['adapterb7l0z4ur'].select(run_doc);




//Case  1 - adapter for set of repetitive functions like CRUD - ideal - compile 1 time, then use CW.Adapter["pocketbase"]
//Case 2 - pipelines. 
await CW.compileAll();

VM6325:1 ✓ PocketBase initialized: undefined
coworker-state.js:178 ✓ Compiled 2 run(s)
2
CW.Adapter['adapterq8i39mys']
{config: {…}, execute: ƒ, rateLimit: ƒ, bodySize: ƒ, method: ƒ, …}
CW.Adapter['adapterq8i39mys']
{config: {…}, execute: ƒ, rateLimit: ƒ, bodySize: ƒ, method: ƒ, …}bodySize: ƒ (c, r)config: {rateLimit: {…}, bodySize: {…}, method: {…}, contentType: {…}}contentType: ƒ (c, r)execute: async ƒ (req, env, rateLimits)method: ƒ (c, r)rateLimit: ƒ (c, r, rl)[[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()
CW.Adapter['adapterq8i39mys'].execute()
Promise {<rejected>: TypeError: Cannot read properties of undefined (reading 'headers')
    at Object.eval [as execute] …}
VM6335:1 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'headers')
eval @ VM6335:1
(anonymous) @ VM6392:1Understand this error
CW.Schema["schemastattgy3m"]
{_schema_doctype: 'State Machine', actions: Array(0), allow_rename: 1, autoname: 'field:statemachine_name', creation: '2013-01-08 15:50:01', …}


//init flow 
javascript// 1. Init - Load documents from DB
await coworker.run({ operation: 'select', from: 'Adapter' });
await coworker.run({ operation: 'select', from: 'Schema' });
// Now CW.runs has the raw data

// 2. Compile - Turn function strings into callable functions
await CW.compileAll();
// Now adapters have runtime functions

// 3. Access
CW.Adapter['http-gateway'].execute(req, env, rateLimits)  // ✅ Compiled runtime
CW.Adapter.memory.select(run_doc)                         // ✅ Compiled runtime
CW.Schema.User.fields                                     // ✅ Static document
CW.Schema['schemastattgy3m'].field_order                 // ✅ Static document







/* version 35
* (x) 35-1 DONE CHANGE COWORKERSTATE name is too long. CHNAGE to CW global
* (x) 35-2 DONE window -> globalThis for  compatibility

*/
// 

//SCHEMA

CREATE TABLE item (
  id TEXT PRIMARY KEY,              -- reserved, DO not use in code
  name TEXT,                        -- used as id in code, unique
  doctype TEXT,
  docstatus INTEGER,                  -- docstatus 
  data TEXT DEFAULT '{}',            -- JSON data field
  owner TEXT DEFAULT '[]',           -- JSON array of user IDs
  _allowed TEXT DEFAULT '[]',        -- JSON array of role/user IDs (write)
  _allowed_read TEXT DEFAULT '[]',   -- JSON array of role/user IDs (read)
  created TEXT DEFAULT CURRENT_TIMESTAMP,
  updated TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_doctype ON item(doctype);
CREATE INDEX idx_user_id ON item((json_extract(data, '$.user_id'))) WHERE doctype = 'User';






SECURITY //draft
POST Request Protection (Proper Order)
│
├─ 1. Rate Limit by IP (FIRST - cheapest check)
│   └─ Reject if exceeded → 429 Too Many Requests
│
├─ 2. Body Size Limit (cheap validation) 
│   └─ Reject if too large → 413 Payload Too Large size_limit_1 (bigger)
│
├─ 3. Basic Request Validation (no parsing yet)
│   ├─ Content-Type check
│   ├─ Method validation
│   └─ Reject malformed → 400 Bad Request
│
├─ 4. NOW check Authorization Header Present?
│   │
│   ├─ Yes → Authenticated Flow
│   │   ├─ Validate token (now safe - already rate limited)
│   │   ├─ Rate limit per user ID (secondary limit)
│   │   ├─ Schema validation
│   │   └─ Process request
│   │
│   └─ No → Public Flow
│       ├─ Already rate limited by IP
│       ├─ Optional: CAPTCHA/proof-of-work for expensive ops
│       ├─ Schema validation
│       └─ Process request (limited functionality)




LEVEL 1 — System (platform sovereignty)
LEVEL 2 — Adapter (infrastructure capability)
LEVEL 3 — Operation viability (semantic existence)
LEVEL 4 — Cross-document authority (early proceccing/ like RBAC / ABAC/ cross document flows)
LEVEL 5 — Document state authority (workflow / lifecycle)
LEVEL 6 — Field semantics (types, values, relations)


LEVELS = {
    "level_1": {
      "name": "System FSM",
      "scope": "overall system status",
      "states": ["booting", "ready", "degraded", "recovering", "fault"],
      "note": "orchestrates lower levels"
    },
    "level_2": {
      "name": "Subsystem/Adapter FSM",
      "scope": "adapter/service status",
      "states": {
        "adapter": "pocketbase",
        "states"["booting", "ready", "degraded", "recovering", "fault"]
    },
  },
    "level_3": {
      "name": "operation feasibility",
      "scope": "multi-document operations",
      "responsibilities": [
        "batch_submit",
        "batch_validate",
        "enforcing per-document RBAC"
      ],
      "note": "aggregates results"
    },
    "level_4": {
      "name": "Cross-Document/Workflow FSM for 1 operation ",
      "scope": "multi-document operations",
      "responsibilities": [
        
        "enforcing per-document RBAC"
      ],
      "note": "aggregates results"
    },
    "level_5": {
      "name": "Core document level for this operation ",
      "scope": "single-document operations",
      "responsibilities": [
        
        "core per document workflow"
      ],
      "note": "aggregates results"
    },
    "level_6": {
      "name": "Single-Document field level FSM",
      "tiers": {
        "tier_1": {
          "name": "System Field Rules",
          "handles": ["defaults", "required", "auto-set"]
        },
        "tier_2": {
          "name": "Field Type Handlers",
          "handles": ["serialization", "validation"]
        },
        "tier_3": {
          "name": "Custom Field Rules",
          "handles": ["computed fields", "cross-field logic"]
        }
      }
    }
}


run(op)  // that starts after LEVEL 1 and 2 loaded 
// key 
run()
 ├─ normalize input
 ├─ resolve operation
 ├─ resolve schema   ❌ fail if missing
 ├─ resolve view     ❌ fail if not resolved
 ├─ compute field set
 ├─ bind authorization
 ├─ freeze execution plan
 ├─ call _exec()
 └─ finalize result

 


System_FMS =

{
  "doctype": "State Machine",
  "name": "System_FSM_level_1",
  "statemachine_name": "System_FSM",
  
  "core_dimensions": ["system_status", "db_connection", "auth_status"],
  
  "core_states": {
    "system_status": {
      "values": [0, 1, 2, 3, -1],
      "options": ["booting", "ready", "degraded", "recovering", "fault"]
    },
    "db_connection": {
      "values": [0, 1, 2, 3, -1],
      "options": ["booting", "ready", "degraded", "recovering", "fault"]
    },
    "auth_status": {
      "values": [0, 1, 2, 3, -1],
      "options": ["booting", "ready", "degraded", "recovering", "fault"]
    }
  },
  
  "default_dimensions": ["initialize", "health_check", "shutdown"],
  
  "default_states": {
    "initialize": {
      "values": [0, 1, 2, -1],
      "options": ["idle", "pending", "success", "error"]
    },
    "health_check": {
      "values": [0, 1, 2, -1],
      "options": ["idle", "pending", "success", "error"]
    },
    "shutdown": {
      "values": [0, 1, 2, -1],
      "options": ["idle", "pending", "success", "error"]
    }
  },
  
  "service_dimensions": ["cache", "queue", "background_jobs"],
  
  "service_states": {
    "cache": {
      "values": [0, 1, 2, 3, -1],
      "options": ["booting", "ready", "degraded", "recovering", "fault"]
    },
    "queue": {
      "values": [0, 1, 2, 3, -1],
      "options": ["booting", "ready", "degraded", "recovering", "fault"]
    },
    "background_jobs": {
      "values": [0, 1, 2, 3, -1],
      "options": ["booting", "ready", "degraded", "recovering", "fault"]
    }
  },
  
  "transitions": {
    "system_level": {
      "0": [1, 2, -1],
      "1": [2, 3, -1],
      "2": [1, 3, -1],
      "3": [1, 2, -1],
      "-1": [3]
    },
    "operation_level": {
      "0": [1],
      "1": [2, -1],
      "2": [0],
      "-1": [0, 1]
    }
  },
  
  "rules": {
    "initialize": {
      "0_to_1": {
        "requires": {
          "system_status": 0,
          "health_check": 0,
          "shutdown": 0
        }
      }
    },
    "health_check": {
      "0_to_1": {
        "requires": {
          "system_status": [1, 2],
          "initialize": 0,
          "shutdown": 0
        }
      }
    },
    "shutdown": {
      "0_to_1": {
        "requires": {
          "system_status": [1, 2, 3, -1],
          "initialize": 0,
          "health_check": 0
        }
      }
    }
  },
  
  "sequences": {
    "initialize": {
      "steps": [
        {
          "dimension": 0,
          "transition": 1
        },
        {
          "execute": "loadConfig",
          "onFailure": {
            "dimension": 0,
            "transition": -1,
            "then": [
              { "core_dimension": 0, "value": -1 },
              { "stop": true }
            ]
          }
        },
        {
          "execute": "connectDatabase",
          "onSuccess": {
            "core_dimension": 1,
            "value": 1
          },
          "onFailure": {
            "dimension": 0,
            "transition": -1,
            "then": [
              { "core_dimension": 0, "value": -1 },
              { "core_dimension": 1, "value": -1 },
              { "stop": true }
            ]
          }
        },
        {
          "execute": "initializeServices",
          "onSuccess": {
            "dimension": 0,
            "transition": 2,
            "then": [
              { "core_dimension": 0, "value": 1 }
            ]
          },
          "onPartialFailure": {
            "dimension": 0,
            "transition": 2,
            "then": [
              { "core_dimension": 0, "value": 2 }
            ]
          },
          "onFailure": {
            "dimension": 0,
            "transition": -1,
            "then": [
              { "core_dimension": 0, "value": -1 },
              { "stop": true }
            ]
          }
        },
        {
          "dimension": 0,
          "transition": 0
        }
      ]
    },
    
    "health_check": {
      "steps": [
        {
          "dimension": 1,
          "transition": 1
        },
        {
          "execute": "checkDatabaseConnection",
          "onSuccess": {
            "core_dimension": 1,
            "value": 1
          },
          "onDegraded": {
            "core_dimension": 1,
            "value": 2
          },
          "onFailure": {
            "core_dimension": 1,
            "value": -1
          }
        },
        {
          "execute": "checkSystemResources",
          "onSuccess": {
            "dimension": 1,
            "transition": 2,
            "then": [
              { "core_dimension": 0, "value": 1 }
            ]
          },
          "onPartialFailure": {
            "dimension": 1,
            "transition": 2,
            "then": [
              { "core_dimension": 0, "value": 2 }
            ]
          },
          "onFailure": {
            "dimension": 1,
            "transition": -1,
            "then": [
              { "core_dimension": 0, "value": -1 }
            ]
          }
        },
        {
          "dimension": 1,
          "transition": 0
        }
      ]
    },
    
    "shutdown": {
      "steps": [
        {
          "dimension": 2,
          "transition": 1
        },
        {
          "execute": "drainConnections",
          "onFailure": {
            "dimension": 2,
            "transition": -1
          }
        },
        {
          "execute": "stopServices",
          "onFailure": {
            "dimension": 2,
            "transition": -1
          }
        },
        {
          "execute": "closeDatabase",
          "onSuccess": {
            "core_dimension": 1,
            "value": 0
          },
          "onFailure": {
            "dimension": 2,
            "transition": -1,
            "then": [
              { "core_dimension": 1, "value": -1 }
            ]
          }
        },
        {
          "dimension": 2,
          "transition": 2,
          "then": [
            { "core_dimension": 0, "value": 0 }
          ]
        },
        {
          "dimension": 2,
          "transition": 0
        }
      ]
    }
  }
}

/*
*
*/

## **Key flow:**
```
User: run(select, Task, name=Task123, adapter=pocketbase)
  ↓
Controller: get pocketbase adapter document
  ↓
Controller: check adapter._states.status (is it ready?)  <- this not correct to pull readiness every time
  ↓
Controller: build run_doc context
  ↓
Controller: call adapter.functions.select(run_doc)
  ↓
Function: mutates run_doc (sets status.code, populates target.data)
  ↓
Controller: read run_doc.status.code
  ↓
  ├─ code=2 (success) → return data
  ├─ code=-10 (recoverable) → trigger fallback, retry
  └─ code=-11 (unrecoverable) → propagate fault, throw error