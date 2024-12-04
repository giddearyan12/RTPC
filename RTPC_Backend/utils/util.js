export function cleanDockerOutput(output) {
    return output.replace(/[\x00-\x1F\x7F]/g, "").trim();
  }