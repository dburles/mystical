"use strict";

const React = require("react");

function InitializeColorMode() {
  return React.createElement("script", {
    key: "mystical-no-flash",
    dangerouslySetInnerHTML: {
      __html: `
        (function() { try {
          var mode = localStorage.getItem('mystical-color-mode');
          document.body.setAttribute('data-color-mode', mode || 'default');
        } catch (e) {} })();`,
    },
  });
}

module.exports = InitializeColorMode;
