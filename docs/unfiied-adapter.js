(async function () {
  // ─────────────────────────────────────────────
  // INPUT: legacy adapter (as stored in DB)
  // ─────────────────────────────────────────────
  const legacyAdapter = {
    config: "{\"base_url\":\"https://jsonplaceholder.typicode.com\",\"timeout\":5000}",
    doctype: "Adapter",
    functions: "{\"get_post\":\"async function(run_doc) { const response = await fetch(run_doc.adapter.config.base_url + '/posts/' + run_doc.input.id); const data = await response.json(); run_doc.target.doctype = 'BlogPost'; run_doc.target.data = [{ doctype: 'BlogPost', name: generateId('BlogPost'), post_id: data.id, user_id: data.userId, title: data.title, body: data.body }]; return run_doc; }\",\"create_post\":\"async function(run_doc) { const response = await fetch(run_doc.adapter.config.base_url + '/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: run_doc.input.title, body: run_doc.input.body, userId: run_doc.input.user_id || 1 }) }); const data = await response.json(); run_doc.target.doctype = 'BlogPost'; run_doc.target.data = [{ doctype: 'BlogPost', name: generateId('BlogPost'), post_id: data.id, user_id: data.userId, title: data.title, body: data.body }]; return run_doc; }\"}",
    name: "adapterypzff9x5"
  };

  // ─────────────────────────────────────────────
  // STEP 1: Parse legacy fields
  // ─────────────────────────────────────────────
  const parsedConfig = JSON.parse(legacyAdapter.config || "{}");
  const parsedFunctions = JSON.parse(legacyAdapter.functions || "{}");

  // ─────────────────────────────────────────────
  // STEP 2: Build new adapter format
  // ─────────────────────────────────────────────
  const adapter = {
    config: {
      name: "http-json",
      ...parsedConfig
    },
    functions: {
      // Mandatory orchestrator
      pipeline: `async function(run_doc) {
        run_doc._pipeline = run_doc._pipeline || {};
        await this.start(run_doc);
        if (run_doc.operation && this[run_doc.operation]) {
          await this[run_doc.operation](run_doc);
        }
        await this.end(run_doc);
        return run_doc;
      }`,

      // Required entry point
      start: `async function(run_doc) {
        run_doc._pipeline.state = \`\${this.config.name}:start\`;
        run_doc.adapter = this;
      }`,

      // Required exit point
      end: `async function(run_doc) {
        run_doc._pipeline.state = \`\${this.config.name}:end\`;
      }`,

      // Legacy functions mapped directly
      ...parsedFunctions
    }
  };

  // ─────────────────────────────────────────────
  // STEP 3: EXECUTOR (eval + bind + execute)
  // ─────────────────────────────────────────────
  adapter.execute = async function (fnName, run_doc) {
    if (!this.functions[fnName]) {
      throw new Error(`Function "${fnName}" not found on adapter`);
    }

    // Eval string → function
    const fn = eval(`(${this.functions[fnName]})`);

    // Bind adapter as `this`
    return await fn.call(this, run_doc);
  };

  // Convenience: execute pipeline
  adapter.run = async function (run_doc) {
    return await this.execute("pipeline", run_doc);
  };

  // ─────────────────────────────────────────────
  // OUTPUT
  // ─────────────────────────────────────────────
  console.log("✅ Migrated Adapter:", adapter);
  window.__adapter = adapter; // expose for testing

})();
