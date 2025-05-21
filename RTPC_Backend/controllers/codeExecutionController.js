import Docker from "dockerode";
const docker = new Docker();

const languageConfig = {
  default: { imageName: "custom-multi-lang" },
};

export const executeCode = async (req, res) => {
  const { code, language, input = "" } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code or language not provided" });
  }

  const imageName = languageConfig.default.imageName;
  let cmd;

  const safeCode = code.replace(/"/g, '\\"').replace(/\$/g, "\\$");
  const lowerLang = language.toLowerCase();

  switch (lowerLang) {
    case "python":
    case "python3":
      cmd = [
        "bash",
        "-c",
        `echo "${safeCode}" > /tmp/script.py && python3 /tmp/script.py <<EOF\n${input}\nEOF`,
      ];
      break;

    case "cpp":
      cmd = [
        "bash",
        "-c",
        `echo '${code}' > /tmp/program.cpp && g++ /tmp/program.cpp -o /tmp/program && echo "${input}" | /tmp/program`,
      ];
      break;

    case "java":
      const classNameMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      const className = classNameMatch ? classNameMatch[1] : "Main";
      cmd = [
        "bash",
        "-c",
        `echo "${safeCode}" > /tmp/${className}.java && javac /tmp/${className}.java && echo "${input}" | java -cp /tmp ${className}`,
      ];
      break;

    case "c":
      cmd = [
        "bash",
        "-c",
        `echo "${safeCode}" > /tmp/program.c && gcc /tmp/program.c -o /tmp/program && echo "${input}" | /tmp/program`,
      ];
      break;

    case "javascript":
    case "js":
      cmd = [
        "bash",
        "-c",
        `echo "${safeCode}" > /tmp/script.js && node /tmp/script.js <<EOF\n${input}\nEOF`,
      ];
      break;

    case "php":
      cmd = [
        "bash",
        "-c",
        `echo "${safeCode}" > /tmp/script.php && php /tmp/script.php <<EOF\n${input}\nEOF`,
      ];
      break;

    default:
      return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    const container = await docker.createContainer({
      Image: imageName,
      Cmd: cmd,
      Tty: false,
      HostConfig: {
        AutoRemove: true,
        Binds: ["./tmp:/tmp"],
      },
    });

    await container.start();

    const logs = await new Promise((resolve, reject) => {
      container.logs(
        { stdout: true, stderr: true, follow: true, tail: 1000 },
        (err, stream) => {
          if (err) return reject(err);
          let output = "";
          stream.on("data", (chunk) => (output += chunk.toString("utf8")));
          stream.on("end", () => resolve(output));
        }
      );
    });

    const out = cleanDockerOutput(logs);
    if (out) res.json({ output: out.trim() });
    else res.status(500).json({ error: "No output from container" });

  } catch (error) {
    console.error("Error during Docker execution:", error);
    res.status(500).json({ error: "Failed to execute code", details: error.message });
  }
};

function cleanDockerOutput(output) {
  return output.replace(/[\x00-\x1F\x7F]/g, "").trim();
}
