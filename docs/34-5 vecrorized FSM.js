core_statemachine = {"config":
 {"doctype": "State Machine",
  "name": "Document_FSM",
  "statemachine_name": "Document_FSM",
  
  "core_dimensions": ["is_submittable", "docstatus", "autosave_enabled", "dirty"],
  
  "core_states": {
    "is_submittable": {
      "values": [0, 1],
      "options": ["false", "true"]
    },
    "docstatus": {
      "values": [0, 1, 2],
      "options": ["Draft", "Submitted", "Cancelled"]
    },
    "autosave_enabled": {
      "values": [0, 1],
      "options": ["false", "true"]
    },
    "dirty": {
      "values": [0, 1],
      "options": ["clean", "dirty"]
    }
  },
  
  "default_dimensions": ["save", "submit", "validate", "cancel"],
  
  "default_states": {
    "save": {
      "values": [0, 1, 2, -1],
      "options": ["idle", "pending", "success", "error"],
      "transitions": {
        "0": [1],
        "1": [2, -1],
        "2": [0],
        "-1": [0, 1]
      }
    },
    "submit": {
      "values": [0, 1, 2, -1],
      "options": ["idle", "pending", "success", "error"],
      "transitions": {
        "0": [1],
        "1": [2, -1],
        "2": [0],
        "-1": [0, 1]
      }
    },
    "validate": {
      "values": [0, 1, 2, -1],
      "options": ["idle", "pending", "valid", "invalid"],
      "transitions": {
        "0": [1],
        "1": [2, -1],
        "2": [0],
        "-1": [0, 1]
      }
    },
    "cancel": {
      "values": [0, 1, 2, -1],
      "options": ["idle", "pending", "success", "error"],
      "transitions": {
        "0": [1],
        "1": [2, -1],
        "2": [0],
        "-1": [0, 1]
      }
    }
  },
  
  "workflow_dimensions": {
    "Sales Order": ["approve", "ship"],
    "Purchase Order": ["approve", "receive"],
    "Task": []
  },
  
  "workflow_states": {
    "approve": {
      "values": [0, 1, 2, -1],
      "options": ["idle", "pending", "approved", "rejected"],
      "transitions": {
        "0": [1],
        "1": [2, -1],
        "2": [0],
        "-1": [0, 1]
      }
    },
    "ship": {
      "values": [0, 1, 2, -1],
      "options": ["idle", "pending", "shipped", "error"],
      "transitions": {
        "0": [1],
        "1": [2, -1],
        "2": [0],
        "-1": [0, 1]
      }
    },
    "receive": {
      "values": [0, 1, 2, -1],
      "options": ["idle", "pending", "received", "error"],
      "transitions": {
        "0": [1],
        "1": [2, -1],
        "2": [0],
        "-1": [0, 1]
      }
    }
  },
  
  "rules": {
    "save": {
      "0_to_1": {
        "requires": {
          "docstatus": 0,
          "dirty": 1,
          "validate": 2,
          "submit": 0,
          "cancel": 0
        }
      },
      "-1_to_1": {
        "requires": {
          "docstatus": 0,
          "dirty": 1,
          "validate": 2,
          "submit": 0,
          "cancel": 0
        }
      }
    },
    "submit": {
      "0_to_1": {
        "requires": {
          "is_submittable": 1,
          "docstatus": 0,
          "dirty": 0,
          "validate": 2,
          "save": 0,
          "cancel": 0
        }
      },
      "-1_to_1": {
        "requires": {
          "is_submittable": 1,
          "docstatus": 0,
          "dirty": 0,
          "validate": 2,
          "save": 0,
          "cancel": 0
        }
      }
    },
    "validate": {
      "0_to_1": {
        "requires": {
          "save": 0,
          "submit": 0,
          "cancel": 0
        }
      },
      "-1_to_1": {
        "requires": {
          "save": 0,
          "submit": 0,
          "cancel": 0
        }
      }
    },
    "cancel": {
      "0_to_1": {
        "requires": {
          "is_submittable": 1,
          "docstatus": 1,
          "save": 0,
          "submit": 0
        }
      },
      "-1_to_1": {
        "requires": {
          "is_submittable": 1,
          "docstatus": 1,
          "save": 0,
          "submit": 0
        }
      }
    }
  },
  
  "sequences": {
    "save": {
      "steps": [
        {
          "dimension": 0,
          "transition": 1
        },
        {
          "execute": "validate",
          "onSuccess": {
            "dimension": 2,
            "transition": 2
          },
          "onFailure": {
            "dimension": 2,
            "transition": -1,
            "then": [
              {
                "dimension": 0,
                "transition": -1
              },
              {
                "stop": true
              }
            ]
          }
        },
        {
          "execute": "dbSave",
          "onSuccess": {
            "dimension": 0,
            "transition": 2,
            "then": [
              {
                "core_dimension": 3,
                "value": 0
              }
            ]
          },
          "onFailure": {
            "dimension": 0,
            "transition": -1,
            "stop": true
          }
        },
        {
          "dimension": 0,
          "transition": 0
        }
      ]
    },
    "submit": {
      "steps": [
        {
          "dimension": 1,
          "transition": 1
        },
        {
          "execute": "validate",
          "onSuccess": {
            "dimension": 2,
            "transition": 2
          },
          "onFailure": {
            "dimension": 2,
            "transition": -1,
            "then": [
              {
                "dimension": 1,
                "transition": -1
              },
              {
                "stop": true
              }
            ]
          }
        },
        {
          "execute": "dbSubmit",
          "onSuccess": {
            "dimension": 1,
            "transition": 2,
            "then": [
              {
                "core_dimension": 1,
                "value": 1
              }
            ]
          },
          "onFailure": {
            "dimension": 1,
            "transition": -1,
            "stop": true
          }
        },
        {
          "dimension": 1,
          "transition": 0
        }
      ]
    },
    "cancel": {
      "steps": [
        {
          "dimension": 3,
          "transition": 1
        },
        {
          "execute": "dbCancel",
          "onSuccess": {
            "dimension": 3,
            "transition": 2,
            "then": [
              {
                "core_dimension": 1,
                "value": 2
              }
            ]
          },
          "onFailure": {
            "dimension": 3,
            "transition": -1,
            "stop": true
          }
        },
        {
          "dimension": 3,
          "transition": 0
        }
      ]
    },
    "validate": {
      "steps": [
        {
          "dimension": 2,
          "transition": 1
        },
        {
          "execute": "validateDocument",
          "onSuccess": {
            "dimension": 2,
            "transition": 2
          },
          "onFailure": {
            "dimension": 2,
            "transition": -1,
            "stop": true
          }
        },
        {
          "dimension": 2,
          "transition": 0
        }
      ]
    }
  }
},
"functions": {// Executes a sequence for a given document and action
  execute: async (document, action, config) => {
    const sequence = config.sequences[action];
    if (!sequence) {
      throw new Error(`Action "${action}" not defined in FSM sequences`);
    }

    // Initialize current action if not present
    if (!document._states.current) {
      document._states.current = config.default_dimensions.map(_ => 0); // idle
    }

    // Map action name → index in current
    const actionIndex = config.default_dimensions.indexOf(action);

    for (const step of sequence.steps) {

      // 1️⃣ If the step is a dimension transition
      if (step.dimension !== undefined) {
        document._states.current[actionIndex] = step.transition;

        // Optional: if step references a core dimension directly
        if (step.core_dimension !== undefined) {
          document._states.core[step.core_dimension] = step.value;
        }

      }

      // 2️⃣ If the step executes another function
      if (step.execute) {
        try {
          const result = await core_statemachine.functions[step.execute](document, config);
          
          if (step.onSuccess) {
            if (step.onSuccess.dimension !== undefined)
              document._states.current[actionIndex] = step.onSuccess.transition;

            if (step.onSuccess.core_dimension !== undefined)
              document._states.core[step.onSuccess.core_dimension] = step.onSuccess.value;

            if (step.onSuccess.then) {
              // Optional chained updates
              for (const t of step.onSuccess.then) {
                if (t.dimension !== undefined)
                  document._states.current[t.dimension] = t.transition;
                if (t.core_dimension !== undefined)
                  document._states.core[t.core_dimension] = t.value;
              }
            }
          }

        } catch (err) {
          if (step.onFailure) {
            if (step.onFailure.dimension !== undefined)
              document._states.current[actionIndex] = step.onFailure.transition;
            if (step.onFailure.then) {
              for (const t of step.onFailure.then) {
                if (t.dimension !== undefined)
                  document._states.current[t.dimension] = t.transition;
              }
            }
            if (step.onFailure.stop) break;
          }
        }
      }

    }

    // Reset action to idle at the end of sequence
    document._states.current[actionIndex] = 0;
    document._states.actions.current = null;

    return document;
  },

  // Example: validateDocument helper function
  validateDocument: async (document, config) => {
    // implement validation logic here, throw if invalid
    if (document._states.core[1] !== 0) { // just an example check
      throw new Error("Document already submitted");
    }
    return true;
  },

  // Example: dbSave helper function
  dbSave: async (document, config) => {
    // simulate DB save
    return true;
  },

  // Example: dbSubmit helper
  dbSubmit: async (document, config) => {
    return true;
  },

  dbCancel: async (document, config) => {
    return true;
  }
}
}





/* we keep in the document  

* Final _states structure (with your unchanged FSM)
* Given your FSM has: */

core_dimensions: ["is_submittable", "docstatus", "autosave_enabled", "dirty"]
default_dimensions: ["save", "submit", "validate", "cancel"]
workflow_dimensions: {"Sales Order": ["approve", "ship"], ...}


document_example = {
  "doctype": "Sales Order",
  "name": "SO-001",
  
  "_states": {
    // Indexed arrays matching FSM dimension order
    "core": [1, 0, 1, 0],      // [is_submittable, docstatus, autosave_enabled, dirty]
    "current": [0, 0, 2, 0],     // [save, submit, validate, cancel]
    "workflow": [0, 0],        // [approve, ship] for Sales Order
    
    // Actions (not indexed, metadata)
    "actions": {
      "current": null,         // current action name OR null
      "available": ["save", "submit", "validate"]  // action names
    },
    

  }
}
/*Key decisions explained
* 1. Core, current, workflow = indexed arrays*/
"core": [1, 0, 1, 0]
//       ^  ^  ^  ^
//       |  |  |  └─ dirty (index 3)
//       |  |  └──── autosave_enabled (index 2)
//       |  └─────── docstatus (index 1)
//       └────────── is_submittable (index 0)
//Maps directly to:
//javascriptfsm.core_dimensions = ["is_submittable", "docstatus", "autosave_enabled", "dirty"]
//2. Actions = names, not indices
"actions": {
  "current": "submit",  // ← action NAME
  "available": ["save", "submit", "validate"]  // ← action NAMES
}
Why names here?

Actions are user-facing intent
UI needs readable names
Controller translates to dimension index when executing

3. Available actions = list of names
javascript"available": ["save", "submit", "validate"]
FSM computes this by checking rules against current state, returns action names.
Complete lifecycle example
Initial state (new document)
javascript"_states": {
  "core": [1, 0, 1, 0],      // is_submittable, docstatus=0 (draft), autosave on, clean
  "current": [0, 0, 0, 0],     // all idle
  "workflow": [0, 0],        // all idle
  "actions": {
    "current": null,
    "available": ["save", "validate"]
  }
}
User triggers validate
javascript// User input
run("update", "SO-001", {
  _states: {
    actions: { current: "validate" }
  }
})

// Controller detects pivot change
// actions.current: null → "validate"

// Controller looks up dimension index
const validateIndex = fsm.default_dimensions.indexOf("validate")  // 2

// FSM starts sequence
// sequences.validate.steps[0]: { dimension: 2, transition: 1 }

// Controller applies
_states.current[2] = 1  // pending
State during validation:
javascript"_states": {
  "core": [1, 0, 1, 0],
  "current": [0, 0, 1, 0],     // validate = 1 (pending)
  "workflow": [0, 0],
  "actions": {
    "current": "validate",
    "available": []          // nothing available while validating
  }
}
Validation completes
javascript// FSM sequence completes
// sequences.validate.steps[2]: { dimension: 2, transition: 2 }

// Controller applies
_states.current[2] = 2  // success
_states.actions.current = null
State after validation:
javascript"_states": {
  "core": [1, 0, 1, 0],
  "current": [0, 0, 2, 0],     // validate = 2 (success)
  "workflow": [0, 0],
  "actions": {
    "current": null,
    "available": ["save", "submit", "validate"]  // more options now
  }
}
User triggers submit
javascriptrun("update", "SO-001", {
  _states: {
    actions: { current: "submit" }
  }
})

// Controller finds submit index
const submitIndex = fsm.default_dimensions.indexOf("submit")  // 1

// FSM executes sequences.submit
// Step 1: dimension 1, transition 1
_states.current[1] = 1

// Step 3 onSuccess: dimension 1, transition 2, then core_dimension 1, value 1
_states.current[1] = 2
_states.core[1] = 1  // docstatus = 1

// Step 4: dimension 1, transition 0
_states.current[1] = 0
Final state (submitted):
javascript"_states": {
  "core": [1, 1, 1, 0],      // docstatus = 1 (submitted)
  "current": [0, 0, 2, 0],     // submit back to idle, validate still success
  "workflow": [0, 0],
  "actions": {
    "current": null,
    "available": ["cancel", "amend"]  // FSM computed new available actions
  }
}
How FSM sequences map to this
Your FSM sequence:
javascript"submit": {
  "steps": [
    { "dimension": 1, "transition": 1 },  // current[1] = 1
    { /* validate check */ },
    { 
      "execute": "dbSubmit",
      "onSuccess": {
        "dimension": 1, "transition": 2,
        "then": [{ "core_dimension": 1, "value": 1 }]
      }
    },
    { "dimension": 1, "transition": 0 }   // current[1] = 0
  ]
}
Maps directly to array mutations:
javascript_states.current[1] = 1      // step 1
_states.current[1] = 2      // step 3 onSuccess
_states.core[1] = 1       // step 3 then
_states.current[1] = 0      // step 4
One-line summary
_states uses indexed arrays for dimensions ([1, 0, 2, 0]) and readable names for actions ("submit"), matching your FSM exactly.

//= multiple state machines =====

we reserve _states globally in every document  for states tracking, we have core_statemachine (core for the system, all doctypes) mapping core_statemachine - mutate _states.core. and additional optional statemachines that are like {doctype}_statemachine, they mutate _states.workflow  no need to define doctype additionally as its defined the schema itsself like task. The whole old state machine is planced under .config the sequencer function is behind funcitons.execute in machine so we have very cliar mapping of 1 state machine to 1 doctype (or general core) and to particular part of _states

3:14 PM
YES! This is very clean architecture
Let me validate the logic:

The architecture
1. _states is globally reserved in ALL documents
javascript
// Every document has _states (universal)
{
  "doctype": "Sales Order",
  "name": "SO-001",
  "_states": {
    "core": [1, 0, 1, 0],      // ← Core State Machine writes here
    "workflow": [0, 0],         // ← Task State Machine writes here (if exists)
    "actions": { ... }
  }
}

{
  "doctype": "Task",
  "name": "TASK-001",
  "_states": {
    "core": [1, 0, 1, 0],      // ← Core State Machine writes here
    "workflow": [0, 0, 0],     // ← Task State Machine writes here
    "actions": { ... }
  }
}
2. Core State Machine = universal for all doctypes
javascript
{
  "doctype": "State Machine",
  "name": "core_statemachine",
  
  // ✅ No document_type - applies to ALL doctypes
  
  // ✅ Targets _states.core
  "target": "_states.core",
  
  "config": {
    "dimensions": ["is_submittable", "docstatus", "autosave_enabled", "dirty"],
    
    "states": {
      "is_submittable": {
        "values": [0, 1],
        "options": ["false", "true"]
      },
      "docstatus": {
        "values": [0, 1, 2],
        "options": ["Draft", "Submitted", "Cancelled"]
      },
      "autosave_enabled": {
        "values": [0, 1],
        "options": ["false", "true"]
      },
      "dirty": {
        "values": [0, 1],
        "options": ["clean", "dirty"]
      }
    },
    
    "sequences": {
      "save": {
        "steps": [
          { "dimension": 3, "transition": 0 }  // dirty → clean
        ]
      },
      "submit": {
        "steps": [
          { "dimension": 1, "transition": 1 }  // docstatus → submitted
        ]
      }
    }
  },
  
  "functions": {
    "execute": async (document, action, config) => {
      // Sequencer logic
      const sequence = config.sequences[action]
      
      for (const step of sequence.steps) {
        if (step.dimension !== undefined) {
          document._states.core[step.dimension] = step.transition
        }
      }
      
      return document
    }
  }
}
3. Doctype-specific State Machine = optional, per doctype
javascript
{
  "doctype": "State Machine",
  "name": "task_statemachine",
  
  // ✅ Name defines doctype (task)
  
  // ✅ Targets _states.workflow
  "target": "_states.workflow",
  
  "config": {
    "dimensions": ["assign", "review", "complete"],
    
    "states": {
      "assign": {
        "values": [0, 1, 2, -1],
        "options": ["idle", "pending", "assigned", "error"]
      },
      "review": {
        "values": [0, 1, 2, -1],
        "options": ["idle", "pending", "reviewed", "rejected"]
      },
      "complete": {
        "values": [0, 1, 2, -1],
        "options": ["idle", "pending", "completed", "error"]
      }
    },
    
    "sequences": {
      "assign": {
        "steps": [
          { "dimension": 0, "transition": 1 },  // assign → pending
          { "execute": "notifyAssignee" },
          { "dimension": 0, "transition": 2 }   // assign → assigned
        ]
      }
    }
  },
  
  "functions": {
    "execute": async (document, action, config) => {
      const sequence = config.sequences[action]
      
      for (const step of sequence.steps) {
        if (step.dimension !== undefined) {
          document._states.workflow[step.dimension] = step.transition
        }
      }
      
      return document
    }
  }
}
4. Doctype schema derives from state machine name
javascript
{
  "doctype": "Task",
  "fields": [
    {
      "fieldname": "_states",
      "type": "FSMState"
      // ✅ No explicit reference needed
      // Field System discovers: task_statemachine exists → use it
    }
  ]
}
Discovery logic
javascript
// Field System discovers state machines by naming convention
async function getStateMachinesForDoctype(doctype) {
  const machines = []
  
  // ✅ Core machine (always present)
  const coreMachine = await loadDocument("State Machine", "core_statemachine")
  machines.push({
    machine: coreMachine,
    target: "_states.core"
  })
  
  // ✅ Doctype-specific machine (optional)
  const doctypeMachineName = `${doctype.toLowerCase()}_statemachine`
  const doctypeMachine = await loadDocument("State Machine", doctypeMachineName)
  
  if (doctypeMachine) {
    machines.push({
      machine: doctypeMachine,
      target: "_states.workflow"
    })
  }
  
  return machines
}

// Usage
const machines = await getStateMachinesForDoctype("Task")
// Returns:
// [
//   { machine: core_statemachine, target: "_states.core" },
//   { machine: task_statemachine, target: "_states.workflow" }
// ]
Execution flow
javascript
async function executeAction(document, action) {
  const machines = await getStateMachinesForDoctype(document.doctype)
  
  for (const { machine, target } of machines) {
    // Check if this machine handles this action
    if (machine.config.sequences[action]) {
      // ✅ Call machine's execute function
      await machine.functions.execute(document, action, machine.config)
    }
  }
  
  return document
}

// Example: Submit a Task
const task = { doctype: "Task", name: "TASK-001", _states: { ... } }

await executeAction(task, "submit")
// → core_statemachine.functions.execute() runs
// → Mutates task._states.core

await executeAction(task, "assign")
// → task_statemachine.functions.execute() runs
// → Mutates task._states.workflow
Clear mapping
State Machine	Target Field	Scope
core_statemachine	_states.core	All doctypes
task_statemachine	_states.workflow	Task only
sales_order_statemachine	_states.workflow	Sales Order only
{doctype}_statemachine	_states.workflow	That doctype only
Benefits of this architecture
✅ Benefit 1: Clear separation
_states.core = universal (save, submit, validate, cancel)
_states.workflow = doctype-specific (assign, approve, ship, etc.)
✅ Benefit 2: Naming convention = discovery
core_statemachine → always loaded
task_statemachine → loaded for Task doctype
No explicit mappings needed
✅ Benefit 3: Config + Functions separation
javascript
"config": {
  // ✅ Pure data (dimensions, states, sequences)
}

"functions": {
  "execute": // ✅ Pure logic (sequencer)
}
✅ Benefit 4: One machine = One target = One doctype
core_statemachine → _states.core → all doctypes
task_statemachine → _states.workflow → Task
Simple, predictable
✅ Benefit 5: Optional workflow machines
javascript
// Sales Order has workflow
sales_order_statemachine exists → _states.workflow used

// Customer has no workflow
customer_statemachine doesn't exist → _states.workflow = [] (empty)
Complete example
Core State Machine
javascript
{
  "name": "core_statemachine",
  "target": "_states.core",
  "config": {
    "dimensions": ["is_submittable", "docstatus", "autosave_enabled", "dirty"],
    "sequences": { ... }
  },
  "functions": {
    "execute": async (doc, action, config) => { /* mutate _states.core */ }
  }
}
Task State Machine
javascript
{
  "name": "task_statemachine",
  "target": "_states.workflow",
  "config": {
    "dimensions": ["assign", "review", "complete"],
    "sequences": { ... }
  },
  "functions": {
    "execute": async (doc, action, config) => { /* mutate _states.workflow */ }
  }
}
Task Document
javascript
{
  "doctype": "Task",
  "name": "TASK-001",
  "_states": {
    "core": [1, 0, 1, 0],      // ← core_statemachine
    "workflow": [0, 0, 0],     // ← task_statemachine
    "actions": {
      "current": null,
      "available": ["save", "assign"]
    }
  }
}
One-line validation
✅ Logic is sound: _states is universal, core_statemachine mutates _states.core (all doctypes), {doctype}_statemachine mutates _states.workflow (optional, per doctype), naming convention enables discovery, config holds data, functions.execute holds sequencer logic — clean 1:1:1 mapping (machine:target:doctype).

// ====STATE MACHINE EVALUATOR====
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function evaluateFSM(fsmConfig, vector_state, doctype) {
  const available = [];
  
  // Get dimensions based on doctype
  const dimensions = [
    ...fsmConfig.default_dimensions,
    ...(fsmConfig.workflow_dimensions[doctype] || [])
  ];
  
  // Early exit: If docstatus != 0, check only cancel
  if (vector_state.docstatus !== 0) {
    if (vector_state.docstatus === 1 && dimensions.includes('cancel')) {
      const cancelIndex = dimensions.indexOf('cancel');
      const stateConfig = fsmConfig.default_states.cancel;
      return evaluateDimension(
        cancelIndex,
        'cancel',
        stateConfig,
        fsmConfig.rules.cancel,
        vector_state
      );
    }
    return [];
  }
  
  // Evaluate all dimensions
  for (let i = 0; i < dimensions.length; i++) {
    const dimensionName = dimensions[i];
    
    // Get state config from default or workflow
    const stateConfig = fsmConfig.default_states[dimensionName] || 
                        fsmConfig.workflow_states[dimensionName];
    
    if (!stateConfig) continue;
    
    const transitions = evaluateDimension(
      i,
      dimensionName,
      stateConfig,
      fsmConfig.rules[dimensionName],
      vector_state
    );
    
    available.push(...transitions);
  }
  
  return available;
}

function evaluateDimension(dimensionIndex, dimensionName, stateConfig, rules, vector_state) {
  const available = [];
  const currentValue = vector_state.default[dimensionIndex];
  
  // Get possible next values from transitions
  const possibleNext = stateConfig.transitions[String(currentValue)] || [];
  
  if (possibleNext.length === 0) return [];
  
  // Check each possible transition
  for (const nextValue of possibleNext) {
    const ruleKey = `${currentValue}_to_${nextValue}`;
    const rule = rules?.[ruleKey];
    
    // No rule = transition always allowed
    if (!rule) {
      available.push({
        dimensionIndex,
        dimensionName,
        from: currentValue,
        to: nextValue,
        action: nextValue === 1 ? dimensionName : null
      });
      continue;
    }
    
    // Check requirements
    if (checkRequirements(rule.requires, vector_state)) {
      available.push({
        dimensionIndex,
        dimensionName,
        from: currentValue,
        to: nextValue,
        action: nextValue === 1 ? dimensionName : null
      });
    }
  }
  
  return available;
}

function checkRequirements(requires, vector_state) {
  if (!requires) return true;
  
  // Check each requirement
  for (const [key, value] of Object.entries(requires)) {
    if (!checkSingleRequirement(key, value, vector_state)) {
      return false;
    }
  }
  
  return true;
}

function checkSingleRequirement(key, value, vector_state) {
  // Check core state first
  if (vector_state.core && key in vector_state.core) {
    const actualValue = vector_state.core[key];
    return Array.isArray(value) ? value.includes(actualValue) : actualValue === value;
  }
  
  // Check default dimensions
  if (vector_state.default && key in vector_state.default) {
    const actualValue = vector_state.default[key];
    return Array.isArray(value) ? value.includes(actualValue) : actualValue === value;
  }
  
  // Check workflow dimensions
  if (vector_state.workflow && key in vector_state.workflow) {
    const actualValue = vector_state.workflow[key];
    return Array.isArray(value) ? value.includes(actualValue) : actualValue === value;
  }
  
  return false;
}

// ============================================================================
// COWORKER.FSM MODULE
// ============================================================================

coworker.FSM = {
  config: null,
  
  async load() {
    const result = await coworker.run({
      operation: "takeone",
      from: "State Machine",
      query: { where: { statemachine_name: "Document_FSM" } }
    });
    
    if (!result.success || !result.target.data[0]) {
      throw new Error("State Machine not found");
    }
    
    this.config = result.target.data[0];
    console.log("✅ FSM loaded:", this.config.statemachine_name);
  },
  
  // Convert document state to flat vector_state for evaluation
  buildVectorState(doc, doctype) {
    const fsm = this.config;
    const vectorState = {};
    
    // Map core dimensions
    fsm.core_dimensions.forEach((dim, i) => {
      vectorState[dim] = doc.fsm_state.core[i];
    });
    
    // Map default dimensions
    fsm.default_dimensions.forEach((dim, i) => {
      vectorState[dim] = doc.fsm_state.default[i];
    });
    
    // Map workflow dimensions
    const workflowDims = fsm.workflow_dimensions[doctype] || [];
    workflowDims.forEach((dim, i) => {
      vectorState[dim] = doc.fsm_state.workflow[i];
    });
    
    // Keep original structure for requirements checking
    vectorState.core = {};
    vectorState.default = {};
    vectorState.workflow = {};
    
    fsm.core_dimensions.forEach((dim, i) => {
      vectorState.core[dim] = doc.fsm_state.core[i];
    });
    
    fsm.default_dimensions.forEach((dim, i) => {
      vectorState.default[dim] = doc.fsm_state.default[i];
    });
    
    workflowDims.forEach((dim, i) => {
      vectorState.workflow[dim] = doc.fsm_state.workflow[i];
    });
    
    return vectorState;
  },
  
  evaluate(doc, doctype) {
    if (!this.config) {
      throw new Error("FSM not loaded. Call FSM.load() first.");
    }
    
    const vectorState = this.buildVectorState(doc, doctype);
    return evaluateFSM(this.config, vectorState, doctype);
  },
  
  getActionsForState(doc, doctype) {
    return this.evaluate(doc, doctype)
      .map(t => t.action)
      .filter(Boolean);
  },
  
  canExecuteAction(action, doc, doctype) {
    return this.getActionsForState(doc, doctype).includes(action);
  },
  
  // Initialize FSM state for new document
  initializeState(doctype, schema) {
    const fsm = this.config;
    
    // Initialize core
    const core = fsm.core_dimensions.map(dim => {
      if (dim === 'is_submittable') return schema.is_submittable ? 1 : 0;
      if (dim === 'docstatus') return 0;
      if (dim === 'autosave_enabled') return 0;
      if (dim === 'dirty') return 0;
      return 0;
    });
    
    // Initialize default (all idle = 0)
    const defaultVector = fsm.default_dimensions.map(() => 0);
    
    // Initialize workflow (all idle = 0)
    const workflowDims = fsm.workflow_dimensions[doctype] || [];
    const workflowVector = workflowDims.map(() => 0);
    
    return {
      core,
      default: defaultVector,
      workflow: workflowVector
    };
  }
};

console.log("✅ FSM module loaded");

//NOT IMPLEMENTED 

//Exactly! You Need a Sequence Player
//You already have the music sheet (FSM sequences), you just need the orchestra conductor (sequence player) to execute it.
//javascript// ═══════════════════════════════════════════════════════════════
// SEQUENCE PLAYER - The Missing Piece
// ═══════════════════════════════════════════════════════════════

coworker.FSM.playSequence = async function(actionName, doc, doctype) {
  const sequence = this.config.sequences[actionName];
  
  if (!sequence) {
    throw new Error(`No sequence defined for action: ${actionName}`);
  }
  
  console.log(`🎬 Playing sequence: ${actionName}`);
  
  // Execute each step in order
  for (let i = 0; i < sequence.steps.length; i++) {
    const step = sequence.steps[i];
    
    console.log(`  Step ${i + 1}/${sequence.steps.length}:`, step);
    
    try {
      await this._executeStep(step, doc, doctype);
    } catch (error) {
      console.error(`❌ Step ${i + 1} failed:`, error);
      throw error;
    }
  }
  
  console.log(`✅ Sequence complete: ${actionName}`);
  return doc;
};

// ═══════════════════════════════════════════════════════════════
// STEP EXECUTOR - Interprets Each Step Type
// ═══════════════════════════════════════════════════════════════

coworker.FSM._executeStep = async function(step, doc, doctype) {
  
  // ─────────────────────────────────────────────────────────────
  // STEP TYPE 1: Update FSM dimension state
  // ─────────────────────────────────────────────────────────────
  if (step.dimension !== undefined && step.transition !== undefined) {
    console.log(`    → Update dimension ${step.dimension} to ${step.transition}`);
    doc.fsm_state.default[step.dimension] = step.transition;
    return;
  }
  
  // ─────────────────────────────────────────────────────────────
  // STEP TYPE 2: Update core dimension
  // ─────────────────────────────────────────────────────────────
  if (step.core_dimension !== undefined && step.value !== undefined) {
    console.log(`    → Update core[${step.core_dimension}] to ${step.value}`);
    doc.fsm_state.core[step.core_dimension] = step.value;
    return;
  }
  
  // ─────────────────────────────────────────────────────────────
  // STEP TYPE 3: Execute sub-operation
  // ─────────────────────────────────────────────────────────────
  if (step.execute) {
    console.log(`    → Execute: ${step.execute}`);
    
    try {
      await this._executeOperation(step.execute, doc, doctype);
      
      // Handle onSuccess
      if (step.onSuccess) {
        console.log(`    ✅ Success, executing onSuccess`);
        await this._handleOutcome(step.onSuccess, doc, doctype);
      }
      
    } catch (error) {
      console.log(`    ❌ Failed, executing onFailure`);
      
      // Handle onFailure
      if (step.onFailure) {
        await this._handleOutcome(step.onFailure, doc, doctype);
        
        if (step.onFailure.stop) {
          throw new Error(`Sequence stopped: ${error.message}`);
        }
      } else {
        throw error;
      }
    }
    
    return;
  }
  
  // ─────────────────────────────────────────────────────────────
  // STEP TYPE 4: Stop execution
  // ─────────────────────────────────────────────────────────────
  if (step.stop) {
    console.log(`    🛑 Stop sequence`);
    throw new Error('Sequence stopped by step directive');
  }
};

// ═══════════════════════════════════════════════════════════════
// OUTCOME HANDLER - Process onSuccess/onFailure
// ═══════════════════════════════════════════════════════════════

coworker.FSM._handleOutcome = async function(outcome, doc, doctype) {
  // Update dimension if specified
  if (outcome.dimension !== undefined && outcome.transition !== undefined) {
    console.log(`      → Set dimension ${outcome.dimension} = ${outcome.transition}`);
    doc.fsm_state.default[outcome.dimension] = outcome.transition;
  }
  
  // Update core dimension if specified
  if (outcome.core_dimension !== undefined && outcome.value !== undefined) {
    console.log(`      → Set core[${outcome.core_dimension}] = ${outcome.value}`);
    doc.fsm_state.core[outcome.core_dimension] = outcome.value;
  }
  
  // Execute "then" steps if present
  if (outcome.then && Array.isArray(outcome.then)) {
    console.log(`      → Execute ${outcome.then.length} then steps`);
    for (const thenStep of outcome.then) {
      await this._executeStep(thenStep, doc, doctype);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// OPERATION EXECUTOR - Maps FSM execute keys to actual logic
// ═══════════════════════════════════════════════════════════════

coworker.FSM._executeOperation = async function(operationName, doc, doctype) {
  
  const operations = {
    
    // ─────────────────────────────────────────────────────────
    "validate": async () => {
      console.log(`      🔍 Running validation`);
      
      // Get schema
      const schema = await coworker.getSchema(doctype);
      
      // Run field validations
      for (const [fieldname, fieldDef] of Object.entries(schema.fields || {})) {
        if (fieldDef.reqd && !doc[fieldname]) {
          throw new Error(`Required field missing: ${fieldname}`);
        }
        
        // Add more validation rules...
      }
      
      // Run custom validation hooks
      await coworker.hooks.run('validate', doctype, doc);
      
      console.log(`      ✅ Validation passed`);
    },
    
    // ─────────────────────────────────────────────────────────
    "validateDocument": async () => {
      // Alias for validate
      await operations.validate();
    },
    
    // ─────────────────────────────────────────────────────────
    "dbSave": async () => {
      console.log(`      💾 Saving to database`);
      
      // Update audit fields
      doc.modified = new Date();
      doc.modified_by = coworker.user?.name || 'System';
      
      // Execute UPDATE operation
      const result = await coworker.run({
        operation: 'update',
        source_doctype: doctype,
        query: { where: { name: doc.name } },
        input: { data: doc },
        options: { includeSchema: false }
      });
      
      // Merge result back into doc
      Object.assign(doc, result.target.data[0]);
      
      console.log(`      ✅ Saved: ${doc.name}`);
    },
    
    // ─────────────────────────────────────────────────────────
    "dbSubmit": async () => {
      console.log(`      📤 Submitting document`);
      
      // Update submit fields
      doc.docstatus = 1;
      doc.submitted_by = coworker.user?.name || 'System';
      doc.submitted_on = new Date();
      
      // Save to database
      await operations.dbSave();
      
      // Run submit hooks
      await coworker.hooks.run('on_submit', doctype, doc);
      
      console.log(`      ✅ Submitted: ${doc.name}`);
    },
    
    // ─────────────────────────────────────────────────────────
    "dbCancel": async () => {
      console.log(`      🚫 Cancelling document`);
      
      // Update cancel fields
      doc.docstatus = 2;
      doc.cancelled_by = coworker.user?.name || 'System';
      doc.cancelled_on = new Date();
      
      // Save to database
      await operations.dbSave();
      
      // Run cancel hooks
      await coworker.hooks.run('on_cancel', doctype, doc);
      
      console.log(`      ✅ Cancelled: ${doc.name}`);
    }
  };
  
  // Execute the operation
  const handler = operations[operationName];
  
  if (!handler) {
    throw new Error(`Unknown operation: ${operationName}`);
  }
  
  await handler();
};

// ═══════════════════════════════════════════════════════════════
// PUBLIC API - User-Facing Actions
// ═══════════════════════════════════════════════════════════════

coworker.actions = {
  
  async save(doctype, doc) {
    // 1. Check if action is allowed
    if (!coworker.FSM.canExecuteAction('save', doc, doctype)) {
      throw new Error('Save not allowed in current state');
    }
    
    // 2. Play the sequence
    await coworker.FSM.playSequence('save', doc, doctype);
    
    return doc;
  },
  
  async submit(doctype, doc) {
    if (!coworker.FSM.canExecuteAction('submit', doc, doctype)) {
      throw new Error('Submit not allowed in current state');
    }
    
    await coworker.FSM.playSequence('submit', doc, doctype);
    return doc;
  },
  
  async cancel(doctype, doc) {
    if (!coworker.FSM.canExecuteAction('cancel', doc, doctype)) {
      throw new Error('Cancel not allowed in current state');
    }
    
    await coworker.FSM.playSequence('cancel', doc, doctype);
    return doc;
  },
  
  async validate(doctype, doc) {
    if (!coworker.FSM.canExecuteAction('validate', doc, doctype)) {
      throw new Error('Validate not allowed in current state');
    }
    
    await coworker.FSM.playSequence('validate', doc, doctype);
    return doc;
  }
};

// ═══════════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════

/*
// Initialize FSM
await coworker.FSM.load();

// Load a document
const doc = await coworker.run({
  operation: 'select',
  source_doctype: 'Sales Order',
  query: { where: { name: 'SO-001' } }
});

// Execute action
await coworker.actions.save('Sales Order', doc.target.data[0]);

// OUTPUT:
// 🎬 Playing sequence: save
//   Step 1/8: { dimension: 0, transition: 1 }
//     → Update dimension 0 to 1
//   Step 2/8: { execute: "validate" }
//     → Execute: validate
//       🔍 Running validation
//       ✅ Validation passed
//     ✅ Success, executing onSuccess
//       → Set dimension 2 = 2
//   Step 3/8: { execute: "dbSave" }
//     → Execute: dbSave
//       💾 Saving to database
//       ✅ Saved: SO-001
//     ✅ Success, executing onSuccess
//       → Set dimension 0 = 2
//       → Set core[3] = 0
//   Step 4/8: { dimension: 0, transition: 0 }
//     → Update dimension 0 to 0
// ✅ Sequence complete: save
*/
What This Gives You

Sequence Player (playSequence) - Iterates through FSM sequence steps
Step Interpreter (_executeStep) - Handles different step types (dimension, execute, stop)
Operation Mapper (_executeOperation) - Maps FSM execute keys to actual logic
Outcome Handler (_handleOutcome) - Processes onSuccess/onFailure/then
Public API (coworker.actions.*) - User-facing methods

Key Features
✅ Declarative - Sequences define WHAT, player executes HOW
✅ Error Handling - Automatic onSuccess/onFailure routing
✅ Traceable - Console logs show execution flow
✅ CRUD Integration - Uses your existing UPDATE operation
✅ Hook Integration - Calls validate/on_submit/on_cancel hooks
This is the "missing piece" - the sequence player that brings your FSM to life!