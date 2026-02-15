
CW.Adapter['adapterq8i39mys']  // ✅ Works
CW.Adapter['http-gateway']      // ❌ Undefined

CW.Schema["schemastattgy3m"]

await CW.compileAll();

// Now use them
const gateway = CW.Adapter['http-gateway'];
coworker-state.js:205 ✓ Compiled 6 function(s)
coworker-state.js:240 ✓ Compiled 1 document(s)
1
gateway
undefined
CW.Adapter['http-gateway']  <-doesntworkYET
undefined
CW.Adapter
{adapterqlegh6hr: {…}, adapterb7l0z4ur: {…}, adapterq8i39mys: {…}}
adapterb7l0z4ur
: 
{_states: '', adapter_name: 'pocketbase', config: {…}, doctype: 'Adapter', functions: {…}, …}
adapterq8i39mys
: 
{_allowed_read: '', _states: '', adapter_name: 'http-gateway', config: {…}, doctype: 'Adapter', …}
adapterqlegh6hr
: 
{_allowed: '', _allowed_read: '', adapter_name: 'memory', config: {…}, doctype: 'Adapter', …}
[[Prototype]]
: 
Object


await coworker.run({
  operation: "create",
  doctype: "Adapter",
  input: {
    adapter_name: "http-gateway",
  }
});
http-gateway

{
    "url": "http://143.198.29.88:8090/",
    "autoCancellation": false,
    "defaultCollection": "item"
}
//Adapters

CW.Adapter.adapterb7l0z4ur

{_states: '', adapter_name: 'pocketbase', config: {…}, doctype: 'Adapter', functions: {…}, …}adapter_name: "pocketbase"config: autoCancellation: falsedefaultCollection: "item"url: "http://143.198.29.88:8090/"[[Prototype]]: Objectdoctype: "Adapter"functions: {init: "function(run_doc) { const adapter = run_doc.target…ase initialized:', config.url); return run_doc; }", select: 'async function(run_doc) { const adapter = run_doc.…Data }; run_doc.success = true; return run_doc; }', insert: 'async function(run_doc) { const adapter = run_doc.…cord }; run_doc.success = true; return run_doc; }', update: 'async function(run_doc) { const adapter = run_doc.…cord }; run_doc.success = true; return run_doc; }', delete: 'async function(run_doc) { const adapter = run_doc.…true }; run_doc.success = true; return run_doc; }'}id: "adapterb7l0z4ur"name: "adapterb7l0z4ur"permissions: ""scripts: [{…}]_allowed: undefined_allowed_read: undefined_states: ""[[Prototype]]: Object
await CW.compileAll();

coworker-state.js:206 ✓ Compiled 6 function(s)
coworker-state.js:233 ✓ Compiled 1 document(s)




await coworker.run({
  operation: "create",
  doctype: "Adapter",
  input: {
    adapter_name: "pocketbase",
  }
});

await coworker.run({
  operation: "create",
  doctype: "Adapter",
  input: {
    adapter_name: "adapter_auth_001",
  }
});
adapter_auth_001


await coworker.run({
  operation: "create",
  from: "Task",
 
  input: {
   task_name: "Task from memory adapter",
  },
  options: { adapter: "memory" },

});



await coworker.run({
  operation: "create",
  doctype: "State Machine",
  input: {
    statemachine_name: "Document_FSM",
    states: { /* ... */ },
    rules: { /* ... */ },
    sequences: { /* ... */ }
  }
});

const states = (await coworker.run({
operation: "select",
from: "Task",
view: "form",
query: { where: { name: "TASK-2025-00003" } }
})).target.data[0]._states;


await coworker.run({

  operation: "select",

  from: "Task",

  view: "form",

  query: { where: { name: "TASK-2025-00003" } }});

await coworker.run({
  operation: "select",
  from: "Task",
  view: "form"
});


(() => {
  const schema = CoworkerState.getCurrentRun().target.schema;
  const buttonFields = schema?.fields.filter(f => f.fieldtype === "Button");
  console.log("Button fields in schema:", buttonFields);
})();

await coworker.run({

  operation: "select",

  from: "Task",

  view: "form",

  query: { where: { name: "Task-q2qqzt6evxghb00" } }});



// Get system fields (from DocType schema)
const systemResult = await coworker.run({
  operation: "select",
  from: "Schema",
  view: "form",
  query: { where: { _schema_doctype: "DocType" } }
});

// Get specific doctype schema (Sales Invoice)
const doctypeResult = await coworker.run({
  operation: "select",
  from: "Schema",
  view: "form",
  query: { where: { _schema_doctype: "Sales Invoice" } }
});

// Extract field names from system fields
const systemFieldNames = new Set(
  systemResult.target.data[0].field_order.map(f => f.fieldname)
);

// Sales Invoice schema object
const salesInvoiceSchema = doctypeResult.target.data[0];

// Find which Sales Invoice fields are system fields
const systemFieldsInDoctype = salesInvoiceSchema.fields.filter(
  f => systemFieldNames.has(f.fieldname)
);

console.log('System fields found in Sales Invoice:', systemFieldsInDoctype);
console.log('Field names:', systemFieldsInDoctype.map(f => f.fieldname));

// Get system fields (from DocType schema)
const systemResult = await coworker.run({
  operation: "select",
  from: "Schema",
  view: "form",
  query: { where: { _schema_doctype: "DocType" } }
});

// Get specific doctype fields (Sales Invoice)
const doctypeResult = await coworker.run({
  operation: "select",
  from: "Schema",
  view: "form",
  query: { where: { _schema_doctype: "Sales Invoice" } }
});

// Extract field names from system fields
const systemFieldNames = new Set(
  systemResult.target.data[0].field_order.map(f => f.fieldname)
);

// Find which Sales Invoice fields are system fields
const systemFieldsInDoctype = doctypeResult.target.data[0].filter(
  f => systemFieldNames.has(f.fieldname)
);

console.log('System fields found in Sales Invoice:', systemFieldsInDoctype);
console.log('Field names:', systemFieldsInDoctype.map(f => f.fieldname));





await coworker.run({
  operation: "select",
  from: "Schema",
  view: "form",
  query: { where: { _schema_doctype: "Sales Invoice" } }}); 

  await coworker.run({
  operation: "select",
  from: "Schema",
  view: "form",
  query: { where: { _schema_doctype: "DocType" } }}); 

await coworker.run({
  operation: "select",
  from: "DocType",
  view: "form",
  query: { where: { name: "Task" } }}); 


await coworker.run({
  operation: "select",
  from: "Adapter",
  view: "form",
  query: { where: { adapter_name: "memory" } }}); 


  await coworker.run({
  operation: "create",
  doctype: "Adapter",
  view: "form",
  input: { adapter_name: "memory" }}); 

  await coworker.run({
  operation: "update",
  from: "Adapter",
  query: { where: { adapter_name: "memory" } },
  input: {
    config: { operators: { "=": "String(a) === String(b)", "!=": "String(a) !== String(b)", ">": "Number(a) > Number(b)", ">=": "Number(a) >= Number(b)", "<": "Number(a) < Number(b)", "<=": "Number(a) <= Number(b)", "~": "new RegExp(b, 'i').test(String(a))" } },
    functions: {
      select: "async function(run_doc) { const query = run_doc.query || {}; const take = query.take; const skip = query.skip || 0; let items = [...window.MEMORY_DB]; if (query.where) { items = this._applyFilter(items, query.where); } if (query.sort) { items = this._applySort(items, query.sort); } const total = items.length; if (take !== undefined) { const start = skip; items = items.slice(start, start + take); const page = skip ? Math.floor(skip / take) + 1 : 1; const totalPages = Math.ceil(total / take); run_doc.output = { data: items, meta: { total, page, pageSize: take, totalPages, hasMore: page < totalPages } }; } else { run_doc.output = { data: items, meta: { total, page: 1, pageSize: total, totalPages: 1, hasMore: false } }; } run_doc.success = true; return run_doc; }",
      _applyFilter: "function(items, filter) { if (!filter) return items; const predicates = this._parseFilter(filter); return items.filter(item => this._evaluatePredicates(item, predicates)); }",
      _parseFilter: "function(filter) { const predicates = []; const parts = filter.split(/(\\s+AND\\s+|\\s+OR\\s+|\\s+&&\\s+|\\s+\\|\\|\\s+)/i); for (let i = 0; i < parts.length; i += 2) { const part = parts[i].trim(); const logicalOp = parts[i + 1]?.trim().toUpperCase(); const cleanPart = part.replace(/^\\(|\\)$/g, ''); const match = cleanPart.match(/^(.+?)\\s*(=|!=|>|>=|<|<=|~)\\s*(.+)$/); if (match) { let [, field, op, value] = match; field = field.replace(/^data\\./, ''); value = value.replace(/^[\"']|[\"']$/g, ''); predicates.push({ field, operator: op, value, logicalOp: logicalOp === 'AND' || logicalOp === '&&' ? 'AND' : logicalOp === 'OR' || logicalOp === '||' ? 'OR' : null }); } } return predicates; }",
      _evaluatePredicates: "function(item, predicates) { if (predicates.length === 0) return true; let result = this._evaluatePredicate(item, predicates[0]); for (let i = 1; i < predicates.length; i++) { const pred = predicates[i]; const match = this._evaluatePredicate(item, pred); const op = predicates[i - 1].logicalOp; result = op === 'AND' ? result && match : op === 'OR' ? result || match : result; } return result; }",
      _evaluatePredicate: "function(item, { field, operator, value }) { const itemValue = item[field]; const evalFn = new Function('a', 'b', `return ${this.config.operators[operator]}`); return evalFn ? evalFn(itemValue, value) : false; }",
      _applySort: "function(items, sort) { if (!sort) return items; const sortFields = sort.split(',').map(s => { const dir = s[0] === '-' ? 'desc' : 'asc'; const field = s.replace(/^[+-]/, '').replace(/^data\\./, ''); return { field, dir }; }); return items.sort((a, b) => { for (const { field, dir } of sortFields) { const aVal = a[field]; const bVal = b[field]; if (aVal < bVal) return dir === 'desc' ? 1 : -1; if (aVal > bVal) return dir === 'desc' ? -1 : 1; } return 0; }); }"
    }
  }
});


await coworker.run({
  operation: "update",
  from: "Adapter",
  query: { where: { adapter_name: "memory" } },
  input: {
    config: { operators: { "=": "String(a) === String(b)", "!=": "String(a) !== String(b)", ">": "Number(a) > Number(b)", ">=": "Number(a) >= Number(b)", "<": "Number(a) < Number(b)", "<=": "Number(a) <= Number(b)", "~": "new RegExp(b, 'i').test(String(a))" } },
    functions: {
      select: "async function(run_doc) { const query = run_doc.query || {}; const take = query.take; const skip = query.skip || 0; let items = [...window.MEMORY_DB]; if (query.where) { items = this._applyFilter(items, query.where); } if (query.sort) { items = this._applySort(items, query.sort); } const total = items.length; if (take !== undefined) { const start = skip; items = items.slice(start, start + take); const page = skip ? Math.floor(skip / take) + 1 : 1; const totalPages = Math.ceil(total / take); run_doc.output = { data: items, meta: { total, page, pageSize: take, totalPages, hasMore: page < totalPages } }; } else { run_doc.output = { data: items, meta: { total, page: 1, pageSize: total, totalPages: 1, hasMore: false } }; } run_doc.success = true; return run_doc; }",
      _applyFilter: "function(items, filter) { if (!filter) return items; const predicates = this._parseFilter(filter); return items.filter(item => this._evaluatePredicates(item, predicates)); }",
      _parseFilter: "function(filter) { const predicates = []; const parts = filter.split(/(\\s+AND\\s+|\\s+OR\\s+|\\s+&&\\s+|\\s+\\|\\|\\s+)/i); for (let i = 0; i < parts.length; i += 2) { const part = parts[i].trim(); const logicalOp = parts[i + 1]?.trim().toUpperCase(); const cleanPart = part.replace(/^\\(|\\)$/g, ''); const match = cleanPart.match(/^(.+?)\\s*(=|!=|>|>=|<|<=|~)\\s*(.+)$/); if (match) { let [, field, op, value] = match; field = field.replace(/^data\\./, ''); value = value.replace(/^[\"']|[\"']$/g, ''); predicates.push({ field, operator: op, value, logicalOp: logicalOp === 'AND' || logicalOp === '&&' ? 'AND' : logicalOp === 'OR' || logicalOp === '||' ? 'OR' : null }); } } return predicates; }",
      _evaluatePredicates: "function(item, predicates) { if (predicates.length === 0) return true; let result = this._evaluatePredicate(item, predicates[0]); for (let i = 1; i < predicates.length; i++) { const pred = predicates[i]; const match = this._evaluatePredicate(item, pred); const op = predicates[i - 1].logicalOp; result = op === 'AND' ? result && match : op === 'OR' ? result || match : result; } return result; }",
      _evaluatePredicate: "function(item, { field, operator, value }) { const itemValue = item[field]; const evalFn = new Function('a', 'b', `return ${this.config.operators[operator]}`); return evalFn ? evalFn(itemValue, value) : false; }",
      _applySort: "function(items, sort) { if (!sort) return items; const sortFields = sort.split(',').map(s => { const dir = s[0] === '-' ? 'desc' : 'asc'; const field = s.replace(/^[+-]/, '').replace(/^data\\./, ''); return { field, dir }; }); return items.sort((a, b) => { for (const { field, dir } of sortFields) { const aVal = a[field]; const bVal = b[field]; if (aVal < bVal) return dir === 'desc' ? 1 : -1; if (aVal > bVal) return dir === 'desc' ? -1 : 1; } return 0; }); }"
    }
  }
});