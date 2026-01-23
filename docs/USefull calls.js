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