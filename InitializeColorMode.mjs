import React from "react";

export default function InitializeColorMode() {
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
