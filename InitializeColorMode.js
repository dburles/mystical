"use strict";

const React = require("react");

function InitializeColorMode() {
  const ref = React.useRef();

  const script = `<script>(function() { try {
    const mode = localStorage.getItem('mystical-color-mode');
    document.body.setAttribute('data-color-mode', mode || 'default');
  } catch (e) {} })();</script>`;

  React.useEffect(() => {
    const fragment = document.createRange().createContextualFragment(script);
    ref.current.append(fragment);
  }, []);

  return React.createElement("div", { ref });
}

module.exports = InitializeColorMode;
