/*Created "State Machine"*/ salesInvoiceSchema

/* New v2 format */

{
  "doctype": "State Machine",
  "name": "Document_FSM",
  "statemachine_name": "Document_FSM",
  
  "states": {
    "validate": {
      "options": ["idle", "pending", "valid", "invalid"],
      "transitions": {
        "idle": ["pending"],
        "pending": ["valid", "invalid"],
        "valid": ["idle"],
        "invalid": ["idle", "pending"]
      }
    },
    "save": {
      "options": ["idle", "pending", "success", "error"],
      "transitions": {
        "idle": ["pending"],
        "pending": ["success", "error"],
        "success": ["idle"],
        "error": ["idle", "pending"]
      }
    },
    "submit": {
      "options": ["idle", "pending", "success", "error"],
      "transitions": {
        "idle": ["pending"],
        "pending": ["success", "error"],
        "success": ["idle"],
        "error": ["idle", "pending"]
      }
    },
    "cancel": {
      "options": ["idle", "pending", "success", "error"],
      "transitions": {
        "idle": ["pending"],
        "pending": ["success", "error"],
        "success": ["idle"],
        "error": ["idle", "pending"]
      }
    }
  },
  
  "rules": {
    "validate": {
      "idle_to_pending": {
        "requires": {
          "save": "idle",
          "submit": "idle",
          "cancel": "idle"
        }
      },
      "invalid_to_pending": {
        "requires": {
          "save": "idle",
          "submit": "idle",
          "cancel": "idle"
        }
      }
    },
    "save": {
      "idle_to_pending": {
        "requires": {
          "docstatus": 0,
          "dirty": 1,
          "validate": "valid",
          "submit": "idle",
          "cancel": "idle"
        }
      },
      "error_to_pending": {
        "requires": {
          "docstatus": 0,
          "dirty": 1,
          "validate": "valid",
          "submit": "idle",
          "cancel": "idle"
        }
      }
    },
    "submit": {
      "idle_to_pending": {
        "requires": {
          "docstatus": 0,
          "dirty": 0,
          "validate": "valid",
          "save": "idle",
          "cancel": "idle"
        }
      },
      "error_to_pending": {
        "requires": {
          "docstatus": 0,
          "dirty": 0,
          "validate": "valid",
          "save": "idle",
          "cancel": "idle"
        }
      }
    },
    "cancel": {
      "idle_to_pending": {
        "requires": {
          "docstatus": 1,
          "save": "idle",
          "submit": "idle"
        }
      },
      "error_to_pending": {
        "requires": {
          "docstatus": 1,
          "save": "idle",
          "submit": "idle"
        }
      }
    }
  },
  
  "sequences": {
    "save": {
      "steps": [
        {
          "transitions": [
            { "state": "save", "value": "pending" }
          ]
        },
        {
          "execute": "validate",
          "onSuccess": [
            { "state": "validate", "value": "valid" }
          ],
          "onFailure": [
            { "state": "validate", "value": "invalid" },
            { "state": "save", "value": "error" },
            { "state": "save", "value": "idle" },
            { "stop": true }
          ]
        },
        {
          "execute": "dbSave",
          "onSuccess": [
            { "state": "save", "value": "success" },
            { "state": "dirty", "value": 0 }
          ],
          "onFailure": [
            { "state": "save", "value": "error" },
            { "state": "save", "value": "idle" },
            { "stop": true }
          ]
        },
        {
          "transitions": [
            { "state": "save", "value": "idle" }
          ]
        }
      ]
    },
    
    "submit": {
      "steps": [
        {
          "transitions": [
            { "state": "submit", "value": "pending" }
          ]
        },
        {
          "execute": "validate",
          "onSuccess": [
            { "state": "validate", "value": "valid" }
          ],
          "onFailure": [
            { "state": "validate", "value": "invalid" },
            { "state": "submit", "value": "error" },
            { "state": "submit", "value": "idle" },
            { "stop": true }
          ]
        },
        {
          "execute": "dbSubmit",
          "onSuccess": [
            { "state": "docstatus", "value": 1 },
            { "state": "submit", "value": "success" }
          ],
          "onFailure": [
            { "state": "submit", "value": "error" },
            { "state": "submit", "value": "idle" },
            { "stop": true }
          ]
        },
        {
          "transitions": [
            { "state": "submit", "value": "idle" }
          ]
        }
      ]
    },
    
    "cancel": {
      "steps": [
        {
          "transitions": [
            { "state": "cancel", "value": "pending" }
          ]
        },
        {
          "execute": "dbCancel",
          "onSuccess": [
            { "state": "docstatus", "value": 2 },
            { "state": "cancel", "value": "success" }
          ],
          "onFailure": [
            { "state": "cancel", "value": "error" },
            { "state": "cancel", "value": "idle" },
            { "stop": true }
          ]
        },
        {
          "transitions": [
            { "state": "cancel", "value": "idle" }
          ]
        }
      ]
    },
    
    "validate": {
      "steps": [
        {
          "transitions": [
            { "state": "validate", "value": "pending" }
          ]
        },
        {
          "execute": "validateDocument",
          "onSuccess": [
            { "state": "validate", "value": "valid" }
          ],
          "onFailure": [
            { "state": "validate", "value": "invalid" },
            { "stop": true }
          ]
        },
        {
          "transitions": [
            { "state": "validate", "value": "idle" }
          ]
        }
      ]
    }
  }
}

{
    "_allowed_read": "",
    "doctype": "State Machine",
    "id": "statemachic8z7z",
    "name": "statemachic8z7z",
    "rules": {
        "validating": {
            "idle_to_validating": {
                "requires": {
                    "saving": "idle",
                    "submitting": "idle",
                    "cancelling": "idle"
                }
            },
            "validatingErrors_to_validating": {
                "requires": {
                    "saving": "idle",
                    "submitting": "idle",
                    "cancelling": "idle"
                }
            }
        },
        "saving": {
            "idle_to_saving": {
                "requires": {
                    "docstatus": 0,
                    "dirty": 1,
                    "validating": "valid",
                    "submitting": "idle",
                    "cancelling": "idle"
                }
            },
            "savingErrors_to_saving": {
                "requires": {
                    "docstatus": 0,
                    "dirty": 1,
                    "validating": "valid",
                    "submitting": "idle",
                    "cancelling": "idle"
                }
            }
        },
        "submitting": {
            "idle_to_submitting": {
                "requires": {
                    "docstatus": 0,
                    "dirty": 0,
                    "validating": "valid",
                    "saving": "idle",
                    "cancelling": "idle"
                }
            },
            "submittingErrors_to_submitting": {
                "requires": {
                    "docstatus": 0,
                    "dirty": 0,
                    "validating": "valid",
                    "saving": "idle",
                    "cancelling": "idle"
                }
            }
        },
        "cancelling": {
            "idle_to_cancelling": {
                "requires": {
                    "docstatus": 1,
                    "saving": "idle",
                    "submitting": "idle"
                }
            },
            "cancellingErrors_to_cancelling": {
                "requires": {
                    "docstatus": 1,
                    "saving": "idle",
                    "submitting": "idle"
                }
            }
        }
    },
    "sequences": {
        "save": {
            "steps": [
                {
                    "transitions": [
                        {
                            "state": "saving",
                            "value": "saving"
                        }
                    ]
                },
                {
                    "execute": "validate",
                    "onSuccess": [
                        {
                            "state": "validating",
                            "value": "valid"
                        }
                    ],
                    "onFailure": [
                        {
                            "state": "validating",
                            "value": "validatingErrors"
                        },
                        {
                            "state": "saving",
                            "value": "savingErrors"
                        },
                        {
                            "state": "saving",
                            "value": "idle"
                        },
                        {
                            "stop": true
                        }
                    ]
                },
                {
                    "execute": "dbSave",
                    "onSuccess": [
                        {
                            "state": "saving",
                            "value": "saved"
                        },
                        {
                            "state": "dirty",
                            "value": 0
                        }
                    ],
                    "onFailure": [
                        {
                            "state": "saving",
                            "value": "savingErrors"
                        },
                        {
                            "state": "saving",
                            "value": "idle"
                        },
                        {
                            "stop": true
                        }
                    ]
                },
                {
                    "transitions": [
                        {
                            "state": "saving",
                            "value": "idle"
                        }
                    ]
                }
            ]
        },
        "submit": {
            "steps": [
                {
                    "transitions": [
                        {
                            "state": "submitting",
                            "value": "submitting"
                        }
                    ]
                },
                {
                    "execute": "validate",
                    "onSuccess": [
                        {
                            "state": "validating",
                            "value": "valid"
                        }
                    ],
                    "onFailure": [
                        {
                            "state": "validating",
                            "value": "validatingErrors"
                        },
                        {
                            "state": "submitting",
                            "value": "submittingErrors"
                        },
                        {
                            "state": "submitting",
                            "value": "idle"
                        },
                        {
                            "stop": true
                        }
                    ]
                },
                {
                    "execute": "dbSubmit",
                    "onSuccess": [
                        {
                            "state": "docstatus",
                            "value": 1
                        },
                        {
                            "state": "submitting",
                            "value": "submitted"
                        }
                    ],
                    "onFailure": [
                        {
                            "state": "submitting",
                            "value": "submittingErrors"
                        },
                        {
                            "state": "submitting",
                            "value": "idle"
                        },
                        {
                            "stop": true
                        }
                    ]
                },
                {
                    "transitions": [
                        {
                            "state": "submitting",
                            "value": "idle"
                        }
                    ]
                }
            ]
        },
        "cancel": {
            "steps": [
                {
                    "transitions": [
                        {
                            "state": "cancelling",
                            "value": "cancelling"
                        }
                    ]
                },
                {
                    "execute": "dbCancel",
                    "onSuccess": [
                        {
                            "state": "docstatus",
                            "value": 2
                        },
                        {
                            "state": "cancelling",
                            "value": "cancelled"
                        }
                    ],
                    "onFailure": [
                        {
                            "state": "cancelling",
                            "value": "cancellingErrors"
                        },
                        {
                            "state": "cancelling",
                            "value": "idle"
                        },
                        {
                            "stop": true
                        }
                    ]
                },
                {
                    "transitions": [
                        {
                            "state": "cancelling",
                            "value": "idle"
                        }
                    ]
                }
            ]
        },
        "validate": {
            "steps": [
                {
                    "transitions": [
                        {
                            "state": "validating",
                            "value": "validating"
                        }
                    ]
                },
                {
                    "execute": "validateDocument",
                    "onSuccess": [
                        {
                            "state": "validating",
                            "value": "valid"
                        }
                    ],
                    "onFailure": [
                        {
                            "state": "validating",
                            "value": "validatingErrors"
                        },
                        {
                            "stop": true
                        }
                    ]
                },
                {
                    "transitions": [
                        {
                            "state": "validating",
                            "value": "idle"
                        }
                    ]
                }
            ]
        }
    },
    "statemachine_name": "Document_FSM",
    "states": {
        "validating": {
            "options": [
                "idle",
                "validating",
                "valid",
                "validatingErrors"
            ],
            "transitions": {
                "idle": [
                    "validating"
                ],
                "validating": [
                    "valid",
                    "validatingErrors"
                ],
                "valid": [
                    "idle"
                ],
                "validatingErrors": [
                    "idle",
                    "validating"
                ]
            }
        },
        "saving": {
            "options": [
                "idle",
                "saving",
                "saved",
                "savingErrors"
            ],
            "transitions": {
                "idle": [
                    "saving"
                ],
                "saving": [
                    "saved",
                    "savingErrors"
                ],
                "saved": [
                    "idle"
                ],
                "savingErrors": [
                    "idle",
                    "saving"
                ]
            }
        },
        "submitting": {
            "options": [
                "idle",
                "submitting",
                "submitted",
                "submittingErrors"
            ],
            "transitions": {
                "idle": [
                    "submitting"
                ],
                "submitting": [
                    "submitted",
                    "submittingErrors"
                ],
                "submitted": [
                    "idle"
                ],
                "submittingErrors": [
                    "idle",
                    "submitting"
                ]
            }
        },
        "cancelling": {
            "options": [
                "idle",
                "cancelling",
                "cancelled",
                "cancellingErrors"
            ],
            "transitions": {
                "idle": [
                    "cancelling"
                ],
                "cancelling": [
                    "cancelled",
                    "cancellingErrors"
                ],
                "cancelled": [
                    "idle"
                ],
                "cancellingErrors": [
                    "idle",
                    "cancelling"
                ]
            }
        }
    }
}



OLD:
{
    "_schema_doctype": "State Machine",
    "actions": [],
    "allow_rename": 1,
    "autoname": "field:statemachine_name",
    "creation": "2013-01-08 15:50:01",
    "doctype": "Schema",
    "document_type": "Document",
    "engine": "InnoDB",
    "field_order": [
        "id",
        "name",
        "adapter_name",
        "restrict_to_domain",
        "column_break_4",
        "disabled",
        "is_custom",
        "desk_access",
        "two_factor_auth",
        "docstatus",
        "owner",
        "_allowed",
        "_allowed_read",
        "states",
        "rules",
        "sequences",
        "permissions",
        "is_default"
    ],
    "fields": [
        {
            "fieldname": "statemachine_name",
            "fieldtype": "Data",
            "label": "adapter Name",
            "oldfieldname": "adapter_name",
            "oldfieldtype": "Data",
            "reqd": 1,
            "unique": 1
        },
        {
            "default": "0",
            "description": "If disabled, this adapter will be removed from all users.",
            "fieldname": "disabled",
            "fieldtype": "Check",
            "label": "Disabled"
        },
        {
            "default": "0",
            "fieldname": "two_factor_auth",
            "fieldtype": "Check",
            "label": "Two Factor Authentication"
        },
        {
            "fieldname": "restrict_to_domain",
            "fieldtype": "Link",
            "label": "Restrict To Domain",
            "options": "Domain"
        },
        {
            "description": "Route: Example \"/app\"",
            "fieldname": "home_page",
            "fieldtype": "Data",
            "label": "Home Page"
        },
        {
            "fieldname": "column_break_4",
            "fieldtype": "Column Break"
        },
        {
            "default": "0",
            "fieldname": "is_custom",
            "fieldtype": "Check",
            "in_list_view": 1,
            "label": "Is Custom"
        },
        {
            "default": "0",
            "fieldname": "docstatus",
            "fieldtype": "Int",
            "hidden": 1,
            "label": "Document Status",
            "no_copy": 1,
            "print_hide": 1,
            "read_only": 1
        },
        {
            "fieldname": "owner",
            "fieldtype": "Data",
            "hidden": 1,
            "label": "Created By",
            "no_copy": 1,
            "print_hide": 1,
            "read_only": 1
        },
        {
            "fieldname": "_allowed",
            "fieldtype": "Code",
            "options": "JSON",
            "hidden": 1,
            "label": "Allowed adapters (Write)",
            "no_copy": 1,
            "print_hide": 1,
            "read_only": 1
        },
        {
            "fieldname": "_allowed_read",
            "fieldtype": "Code",
            "options": "JSON",
            "hidden": 1,
            "label": "Allowed adapters (Read)",
            "no_copy": 1,
            "print_hide": 1,
            "read_only": 1
        },
        {
            "fieldname": "states",
            "fieldtype": "Code",
            "options": "JSON",
            "label": "Adapter Configuration",
            "description": "Static or runtime configuration for the adapter"
        },
        {
            "fieldname": "rules",
            "fieldtype": "Code",
            "options": "JSON",
            "label": "Adapter Functions",
            "description": ""
        },
        {
            "fieldname": "sequences",
            "fieldtype": "Code",
            "options": "JSON",
            "label": "Adapter Functions",
            "description": ""
        },
        {
            "fieldname": "permissions",
            "fieldtype": "Code",
            "options": "JSON",
            "label": "Adapter Permissions",
            "description": "Fine-grained permission rules beyond read/write"
        },
        {
            "default": "0",
            "description": "This format is used to use select this document as default",
            "fieldname": "is_default",
            "fieldtype": "Check",
            "in_list_view": 1,
            "label": "Is Default"
        }
    ],
    "icon": "fa fa-bookmark",
    "id": "schemastattgy3m",
    "idx": 1,
    "index_web_pages_for_search": 1,
    "links": [],
    "modified": "2024-09-19 17:07:08.672124",
    "modified_by": "Administrator",
    "module": "Core",
    "name": "schemastattgy3m",
    "naming_rule": "By fieldname",
    "owner": "",
    "permissions": [
        {
            "create": 1,
            "delete": 1,
            "email": 1,
            "print": 1,
            "read": 1,
            "report": 1,
            "role": "System Manager",
            "share": 1,
            "write": 1
        }
    ],
    "quick_entry": 1,
    "sort_field": "creation",
    "sort_order": "DESC",
    "states": [],
    "track_changes": 1,
    "translated_doctype": 1
}

/*35
* DIRECTIONS:
* add _states: [] to the schemas 
* - dont USE states[] from Frappe schema - its just list of workflow states for doctypes
* we use Task doctype for piloting this state machine. 
* We need to consolidate _states inside doc, as conveniece, we can not use input{} as _states are mutated
Decision

in schema 

run_doc.states = {
  docstatus: 0,              // 0 | 1 | 2
  dirty: 0,                  // 0 | 1
  
  // Process states (error is a value, not separate field)
  validating: "idle",        // "idle" | "validating" | "valid" | "validatingErrors"
  saving: "idle",            // "idle" | "saving" | "saved" | "savingErrors"
  submitting: "idle",        // "idle" | "submitting" | "submitted" | "submittingErrors"
  cancelling: "idle",        // "idle" | "cancelling" | "cancelled" | "cancellingErrors"
  
  is_submittable: 1,
  autosave_enabled: 1
}

clean */

{
  "docstatus": 0,              
  dirty: 0,              
  
  // Process states (error is a value, not separate field)
  validating: "idle",        // "idle" | "validating" | "valid" | "validatingErrors"
  saving: "idle",            // "idle" | "saving" | "saved" | "savingErrors"
  submitting: "idle",        // "idle" | "submitting" | "submitted" | "submittingErrors"
  cancelling: "idle",        // "idle" | "cancelling" | "cancelled" | "cancellingErrors"
  
  is_submittable: 1,
  autosave_enabled: 1
}
*/
{
    "_schema_doctype": "Adapter",
    "actions": [],
    "allow_rename": 1,
    "autoname": "field:adapter_name",
    "creation": "2013-01-08 15:50:01",
    "doctype": "Schema",
    "document_type": "Document",
    "engine": "InnoDB",
    "field_order": [
        "id",
        "name",
        "adapter_name",
        "restrict_to_domain",
        "column_break_4",
        "disabled",
        "is_custom",
        "desk_access",
        "two_factor_auth",
        "docstatus",
        "owner",
        "_allowed",
        "_allowed_read",
        "config",
        "functions",
        "permissions",
        "is_default"
    ],
    "fields": [
        {
            "fieldname": "adapter_name",
            "fieldtype": "Data",
            "label": "adapter Name",
            "oldfieldname": "adapter_name",
            "oldfieldtype": "Data",
            "reqd": 1,
            "unique": 1
        },
        {
            "default": "0",
            "description": "If disabled, this adapter will be removed from all users.",
            "fieldname": "disabled",
            "fieldtype": "Check",
            "label": "Disabled"
        },
        {
            "default": "0",
            "fieldname": "two_factor_auth",
            "fieldtype": "Check",
            "label": "Two Factor Authentication"
        },
        {
            "fieldname": "restrict_to_domain",
            "fieldtype": "Link",
            "label": "Restrict To Domain",
            "options": "Domain"
        },
        {
            "description": "Route: Example \"/app\"",
            "fieldname": "home_page",
            "fieldtype": "Data",
            "label": "Home Page"
        },
        {
            "fieldname": "column_break_4",
            "fieldtype": "Column Break"
        },
        {
            "default": "0",
            "fieldname": "is_custom",
            "fieldtype": "Check",
            "in_list_view": 1,
            "label": "Is Custom"
        },
        {
            "default": "0",
            "fieldname": "docstatus",
            "fieldtype": "Int",
            "hidden": 1,
            "label": "Document Status",
            "no_copy": 1,
            "print_hide": 1,
            "read_only": 1
        },
        {
            "fieldname": "owner",
            "fieldtype": "Data",
            "hidden": 1,
            "label": "Created By",
            "no_copy": 1,
            "print_hide": 1,
            "read_only": 1
        },
        {
            "fieldname": "_allowed",
            "fieldtype": "Code",
            "options": "JSON",
            "hidden": 1,
            "label": "Allowed adapters (Write)",
            "no_copy": 1,
            "print_hide": 1,
            "read_only": 1
        },
        {
            "fieldname": "_allowed_read",
            "fieldtype": "Code",
            "options": "JSON",
            "hidden": 1,
            "label": "Allowed adapters (Read)",
            "no_copy": 1,
            "print_hide": 1,
            "read_only": 1
        },
        {
            "fieldname": "config",
            "fieldtype": "Code",
            "options": "JSON",
            "label": "Adapter Configuration",
            "description": "Static or runtime configuration for the adapter"
        },
        {
            "fieldname": "functions",
            "fieldtype": "Code",
            "options": "JSON",
            "label": "Adapter Functions",
            "description": "Callable adapter functions or operation mappings"
        },
        {
            "fieldname": "permissions",
            "fieldtype": "Code",
            "options": "JSON",
            "label": "Adapter Permissions",
            "description": "Fine-grained permission rules beyond read/write"
        },
        {
            "default": "0",
            "description": "This format is used to use select this document as default",
            "fieldname": "is_default",
            "fieldtype": "Check",
            "in_list_view": 1,
            "label": "Is Default"
        }
    ],
    "icon": "fa fa-bookmark",
    "id": "schemaadaptht8e",
    "idx": 1,
    "index_web_pages_for_search": 1,
    "links": [],
    "modified": "2024-09-19 17:07:08.672124",
    "modified_by": "Administrator",
    "module": "Core",
    "name": "schemaadaptht8e",
    "naming_rule": "By fieldname",
    "owner": "",
    "permissions": [
        {
            "create": 1,
            "delete": 1,
            "email": 1,
            "print": 1,
            "read": 1,
            "report": 1,
            "role": "System Manager",
            "share": 1,
            "write": 1
        }
    ],
    "quick_entry": 1,
    "sort_field": "creation",
    "sort_order": "DESC",
    "states": [],
    "track_changes": 1,
    "translated_doctype": 1
}