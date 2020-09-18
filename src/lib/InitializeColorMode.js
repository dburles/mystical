'use strict';

const React = require('react');

const InitializeColorMode = () => {
  return (
    <script
      key="mystical-no-flash"
      dangerouslySetInnerHTML={{
        __html: `(function() { try {
          var mode = localStorage.getItem('mystical-color-mode');
          if (!mode) return;
          document.body.setAttribute('data-color-mode', mode);
        } catch (e) {} })();`,
      }}
    />
  );
};

module.exports = InitializeColorMode;
