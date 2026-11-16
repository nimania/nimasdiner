// Locale the visible UI only. Keep URLs, numeric form values, date attributes,
// structured data, scripts, datasets and stored calculations in their original form.
(() => {
  "use strict";
  const digits = "۰۱۲۳۴۵۶۷۸۹";
  const latin = /[0-9]/;
  const translate = value => String(value).replace(/[0-9]/g, d => digits[d.charCodeAt(0) - 48]);
  const protectedTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "PRE", "CODE", "KBD", "SAMP", "OPTION"]);
  const readableAttributes = ["alt", "aria-label", "title", "placeholder"];

  function protectedNode(node) {
    let element = node.nodeType === 1 ? node : node.parentElement;
    while (element) {
      if (protectedTags.has(element.tagName) ||
          element.hasAttribute("data-keep-latin-digits") ||
          element.isContentEditable) return true;
      element = element.parentElement;
    }
    return false;
  }

  function localizeOne(node) {
    if (protectedNode(node)) return;
    if (node.nodeType === 3) {
      if (node.nodeValue && latin.test(node.nodeValue)) {
        node.nodeValue = translate(node.nodeValue);
      }
    } else if (node.nodeType === 1) {
      for (const attribute of readableAttributes) {
        const value = node.getAttribute(attribute);
        if (value && latin.test(value)) node.setAttribute(attribute, translate(value));
      }
    }
  }

  function localizeSubtree(node) {
    if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 3) return;
    if (node.nodeType === 3) { localizeOne(node); return; }
    if (protectedNode(node)) return;
    localizeOne(node);
    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      { acceptNode: descendant => protectedNode(descendant)
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT }
    );
    let next;
    while ((next = walker.nextNode())) localizeOne(next);
  }

  const root = document.documentElement;
  if (!root) return;
  localizeSubtree(root);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "characterData") {
        localizeOne(record.target);
      } else if (record.type === "attributes") {
        localizeOne(record.target);
      } else {
        for (const node of record.addedNodes) localizeSubtree(node);
      }
    }
  });
  observer.observe(root, {
    childList: true, subtree: true, characterData: true, attributes: true,
    attributeFilter: readableAttributes
  });
})();
