import snapshot from "snapshot-assertion/assertSnapshot.mjs";
import TestDirector from "test-director/TestDirector.mjs";
import transformStyles from "../private/transformStyles.js";
import snapshotPath from "./lib/snapshotPath.mjs";
import theme from "./lib/theme.mjs";

export default function (tests) {
  tests.add("transformStyles", async () => {
    const tests = new TestDirector();

    tests.add("colors", async () => {
      const styles = transformStyles({
        borderColor: "orange.500",
        color: "orange.500",
      })({ theme });

      await snapshot(
        JSON.stringify(styles),
        snapshotPath("transformStyles-colors.json")
      );
    });

    await tests.run(true);
  });
}
