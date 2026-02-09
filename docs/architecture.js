/* version 35
* (x) 35-1 DONE CHANGE COWORKERSTATE name is too long. CHNAGE to CW global
* (x) 35-2 DONE window -> globalThis for  compatibility

*/
//


LEVEL 1 — System (platform sovereignty)
LEVEL 2 — Adapter (infrastructure capability)
LEVEL 3 — Operation viability (semantic existence)
LEVEL 4 — Cross-document authority (RBAC / ABAC)
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