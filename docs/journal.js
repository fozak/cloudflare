/*Created "State Machine"*/ salesInvoiceSchema

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