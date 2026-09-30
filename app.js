/* SOC 2 System Description Skeleton Generator
 * Drafting aid only. Not an audit, attestation, CPA opinion, or legal advice. */
(function () {
  "use strict";

  var STORAGE_KEY = "soc2sysdesc";
  var dataset = null;
  var els = {};

  var FIELD_IDS = [
    "companyName", "serviceName", "reportPeriod", "reportType",
    "servicesDesc", "inScope", "outOfScope",
    "commitments", "requirements", "infrastructure",
    "softwareFlows", "orgStructure", "keyRoles",
    "subserviceOrgs", "cuecs"
  ];

  var SCOPE_IDS = {
    Availability: "scopeAvailability",
    "Processing Integrity": "scopeProcessing",
    Confidentiality: "scopeConfidentiality",
    Privacy: "scopePrivacy"
  };

  function $(id) { return document.getElementById(id); }

  function init() {
    FIELD_IDS.forEach(function (id) { els[id] = $(id); });
    Object.keys(SCOPE_IDS).forEach(function (cat) { els[SCOPE_IDS[cat]] = $(SCOPE_IDS[cat]); });
    els.preview = $("preview");

    fetch("data/tsc.json")
      .then(function (r) {
        if (!r.ok) { throw new Error("Could not load data/tsc.json (HTTP " + r.status + ")"); }
        return r.json();
      })
      .then(function (d) {
        dataset = d;
        restore();
        bind();
        render();
      })
      .catch(function (err) {
        els.preview.innerHTML = '<p class="empty">Error loading criteria dataset: ' +
          escapeHtml(err.message) + "</p>";
      });

    $("copyBtn").addEventListener("click", copyMarkdown);
    $("downloadBtn").addEventListener("click", downloadMarkdown);
    $("resetBtn").addEventListener("click", resetForm);
  }

  function bind() {
    var saveTimer = null;
    function schedule() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { persist(); render(); }, 250);
    }
    FIELD_IDS.forEach(function (id) {
      els[id].addEventListener("input", schedule);
      els[id].addEventListener("change", schedule);
    });
    Object.keys(SCOPE_IDS).forEach(function (cat) {
      els[SCOPE_IDS[cat]].addEventListener("change", function () { persist(); render(); });
    });
  }

  function persist() {
    var state = { fields: {}, scope: {} };
    FIELD_IDS.forEach(function (id) { state.fields[id] = els[id].value; });
    Object.keys(SCOPE_IDS).forEach(function (cat) { state.scope[cat] = els[SCOPE_IDS[cat]].checked; });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  function restore() {
    var raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }
    if (!raw) { return; }
    try {
      var state = JSON.parse(raw);
      FIELD_IDS.forEach(function (id) {
        if (state.fields && typeof state.fields[id] === "string") { els[id].value = state.fields[id]; }
      });
      Object.keys(SCOPE_IDS).forEach(function (cat) {
        if (state.scope && typeof state.scope[cat] === "boolean") { els[SCOPE_IDS[cat]].checked = state.scope[cat]; }
      });
    } catch (e) { /* corrupt state, start fresh */ }
  }

  function resetForm() {
    FIELD_IDS.forEach(function (id) {
      els[id].value = (id === "reportType") ? "Type II" : "";
    });
    Object.keys(SCOPE_IDS).forEach(function (cat) { els[SCOPE_IDS[cat]].checked = false; });
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }
    render();
  }

  function val(id) { return (els[id].value || "").trim(); }

  function block(label, text) {
    if (text) { return "### " + label + "\n\n" + text + "\n\n"; }
    return "### " + label + "\n\n*[Not provided yet]*\n\n";
  }

  function inScopeCategories() {
    var cats = ["Security"];
    Object.keys(SCOPE_IDS).forEach(function (cat) {
      if (els[SCOPE_IDS[cat]].checked) { cats.push(cat); }
    });
    return cats;
  }

  function generateMarkdown() {
    var L = [];
    var company = val("companyName") || "[COMPANY NAME]";
    var service = val("serviceName") || "[SERVICE NAME]";
    var period = val("reportPeriod") || "[REPORT PERIOD]";
    var rtype = val("reportType") || "Type II";
    var cats = inScopeCategories();

    L.push("# System Description");
    L.push("");
    L.push("**Company:** " + company);
    L.push("**System:** " + service);
    L.push("**Report type:** SOC 2 " + rtype);
    L.push("**Period:** " + period);
    L.push("");
    L.push("> Drafting aid only. This skeleton is a starting point, not a complete system description. Not an audit, attestation, CPA opinion, or legal advice.");
    L.push("");
    L.push("---");
    L.push("");
    L.push("## 1. Company background");
    L.push("");
    L.push("*[Describe the company: history, size, locations, and business model.]*");
    L.push("");
    L.push("## 2. Description of services provided");
    L.push("");
    L.push(val("servicesDesc") || "*[Describe the service, who uses it, and the value it provides.]*");
    L.push("");
    L.push("## 3. System boundaries");
    L.push("");
    L.push(block("In scope", val("inScope")));
    L.push(block("Out of scope", val("outOfScope")));
    L.push("## 4. Principal service commitments and system requirements");
    L.push("");
    L.push(block("Principal service commitments", val("commitments")));
    L.push(block("System requirements", val("requirements")));
    L.push("## 5. Infrastructure");
    L.push("");
    L.push(val("infrastructure") || "*[Describe hosting, cloud providers, data centers, and network architecture.]*");
    L.push("");
    L.push("## 6. Software and data flows");
    L.push("");
    L.push(val("softwareFlows") || "*[Describe key applications, datastores, integrations, and data flow from input to output.]*");
    L.push("");
    L.push("## 7. Organizational structure and key roles");
    L.push("");
    L.push(block("Organizational structure", val("orgStructure")));
    L.push(block("Key roles and responsibilities", val("keyRoles")));
    L.push("## 8. Subservice organizations");
    L.push("");
    L.push(val("subserviceOrgs") || "*[List subservice organizations and whether each is carved out or included. If none, state that no subservice organizations are used.]*");
    L.push("");
    L.push("## 9. Complementary user entity controls (CUECs)");
    L.push("");
    L.push(val("cuecs") || "*[Describe controls customers must operate for the entity's controls to achieve their objectives. If none, state that no CUECs are necessary.]*");
    L.push("");
    L.push("## 10. Trust Services Categories in scope");
    L.push("");
    cats.forEach(function (c) {
      var info = dataset.categories[c];
      L.push("- **" + c + "**" + (info.required ? " (required in every SOC 2 engagement)" : " (optional, in scope for this engagement)"));
    });
    L.push("");

    cats.forEach(function (cat) {
      var info = dataset.categories[cat];
      L.push("## Controls: " + cat + " (" + info.code + ")");
      L.push("");
      L.push("*" + info.description + "*");
      L.push("");
      dataset.criteria.forEach(function (c) {
        if (c.category !== cat) { return; }
        L.push("### " + c.id + " " + c.title);
        L.push("");
        L.push("[DESCRIBE CONTROL HERE]");
        L.push("");
        L.push("<!-- Suggested evidence: " + c.typical_evidence.join("; ") + " -->");
        L.push("");
      });
    });

    L.push("---");
    L.push("");
    L.push("*Skeleton generated by the SOC 2 System Description Skeleton Generator (AI Tech Pros). Drafting aid only, not an audit, attestation, CPA opinion, or legal advice.*");
    L.push("");
    return L.join("\n");
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function mdToHtml(md) {
    var lines = md.split("\n");
    var html = [];
    var inList = false;
    lines.forEach(function (line) {
      var t = line.trim();
      if (/^<!--.*-->$/.test(t)) { return; }
      if (t === "---") { if (inList) { html.push("</ul>"); inList = false; } html.push("<hr>"); return; }
      if (/^# /.test(t)) { if (inList) { html.push("</ul>"); inList = false; } html.push("<h1>" + inline(t.slice(2)) + "</h1>"); return; }
      if (/^## /.test(t)) { if (inList) { html.push("</ul>"); inList = false; } html.push("<h2>" + inline(t.slice(3)) + "</h2>"); return; }
      if (/^### /.test(t)) { if (inList) { html.push("</ul>"); inList = false; } html.push("<h3>" + inline(t.slice(4)) + "</h3>"); return; }
      if (/^- /.test(t)) {
        if (!inList) { html.push("<ul>"); inList = true; }
        html.push("<li>" + inline(t.slice(2)) + "</li>");
        return;
      }
      if (inList) { html.push("</ul>"); inList = false; }
      if (t === "") { return; }
      html.push("<p>" + inline(t) + "</p>");
    });
    if (inList) { html.push("</ul>"); }
    return html.join("\n");
  }

  function inline(t) {
    var h = escapeHtml(t);
    h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/\[DESCRIBE CONTROL HERE\]/g, '<span class="placeholder">[DESCRIBE CONTROL HERE]</span>');
    h = h.replace(/^\*\[Not provided yet\]\*$/, '<span class="empty">[Not provided yet]</span>');
    h = h.replace(/^\*\[([^\]]+)\]\*$/, '<span class="empty">[$1]</span>');
    return h;
  }

  function render() {
    if (!dataset) { return; }
    els.preview.innerHTML = mdToHtml(generateMarkdown());
  }

  function slugify(s) {
    return (s || "soc2-system-description")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "soc2-system-description";
  }

  function downloadMarkdown() {
    if (!dataset) { return; }
    var md = generateMarkdown();
    var blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = slugify(val("serviceName")) + "-system-description-skeleton.md";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function copyMarkdown() {
    if (!dataset) { return; }
    var md = generateMarkdown();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).then(function () {
        flash("copyBtn", "Copied");
      }, function () { fallbackCopy(md); });
    } else { fallbackCopy(md); }
  }

  function fallbackCopy(md) {
    var ta = document.createElement("textarea");
    ta.value = md;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); flash("copyBtn", "Copied"); }
    catch (e) { flash("copyBtn", "Copy failed"); }
    ta.remove();
  }

  function flash(id, text) {
    var b = $(id);
    var orig = b.textContent;
    b.textContent = text;
    setTimeout(function () { b.textContent = orig; }, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
