import useMystical from "./useMystical.mjs";

export default function useColorMode() {
  const { theme, mystical } = useMystical();

  function setColorMode(mode) {
    if (
      mode === "default" ||
      (theme.colors?.modes && theme.colors.modes[mode])
    ) {
      return mystical.setColorMode(mode);
    } else {
      throw new Error(
        `Color mode '${mode}' not found, did you forget to set it in your theme?`
      );
    }
  }

  return [mystical.colorMode, setColorMode];
}
