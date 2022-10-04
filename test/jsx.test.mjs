import TestDirector from "test-director/TestDirector.mjs";
import { create } from "react-test-renderer";
import jsx from "../jsx.js";
import MysticalProvider from "../MysticalProvider.js";
import theme from "./lib/theme.mjs";
import assert from "assert";
import ColorSchemeBoundary from "../ColorSchemeBoundary.js";

export default function (tests) {
  tests.add("jsx", async () => {
    const tests = new TestDirector();

    tests.add("css prop adds themed styles", async () => {
      const x = create(
        jsx(
          MysticalProvider,
          { theme },
          jsx("div", { css: { color: "slate.500" } })
        )
      );

      const result = x.toJSON();

      assert.strictEqual(
        result[2].props.dangerouslySetInnerHTML.__html,
        ".css-1yhkj6b{color:var(--colors-slate-500);}"
      );
    });

    tests.add("cssDark prop adds dark mode styles", async () => {
      const x = create(
        jsx(
          MysticalProvider,
          { theme },
          jsx("div", {
            css: { color: "slate.500" },
            cssDark: { color: "slate.100" },
          })
        )
      );

      const result = x.toJSON();

      assert.strictEqual(
        result[2].props.dangerouslySetInnerHTML.__html,
        '.css-1o6c2gx{color:var(--colors-slate-500);}[data-color-mode="dark"] .css-1o6c2gx{color:var(--colors-slate-100);}'
      );
    });

    tests.add(
      "cssDark prop skips dark mode styles with ColorSchemeBoundary provider set to default",
      async () => {
        const x = create(
          jsx(
            MysticalProvider,
            { theme },
            jsx(
              ColorSchemeBoundary,
              null,
              jsx("div", {
                css: { color: "slate.500" },
                cssDark: { color: "slate.100" },
              })
            )
          )
        );

        const result = x.toJSON();

        assert.strictEqual(
          result[2].props.dangerouslySetInnerHTML.__html,
          ".css-1yhkj6b{color:var(--colors-slate-500);}"
        );
      }
    );

    await tests.run(true);
  });
}
