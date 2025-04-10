import dockerode from "dockerode";

const docker = new dockerode();

const languageConfig = {
  python: { versionIndex: "1" },
  java: { versionIndex: "3" },
  cpp: { versionIndex: "4" },
  php: { versionIndex: "3" },
  c: { versionIndex: "4" },
  javascript: { versionIndex: "1" },
};

export const executeCode = async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code or language not provided" });
  }

  let imageName = "node";
  let cmd = ["node", "-e", code];

  switch (language) {
    case "python":
    case "python3":
      imageName = "python";
      cmd = [
        "bash",
        "-c",
        `echo "${code.replace(/"/g, '\\"')}" > /tmp/script.py && python3 /tmp/script.py <<EOF\n${input}\nEOF`,
      ];
      break;

    case "cpp":
      imageName = "gcc";
      cmd = [
        "bash",
        "-c",
        `echo '${code}' > program.cpp && g++ program.cpp -o program && echo "${input}" | ./program`,
      ];
      break;

    case "java":
      imageName = "openjdk:11";
      const classNameMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      const className = classNameMatch ? classNameMatch[1] : "Main";
      cmd = [
        "bash",
        "-c",
        `echo "${code.replace(/"/g, '\\"')}" > ${className}.java && javac ${className}.java && echo "${input}" | java ${className}`,
      ];
      break;

    case "c":
      imageName = "gcc";
      cmd = [
        "bash",
        "-c",
        `echo "${code.replace(/"/g, '\\"')}" > program.c && gcc program.c -o program && echo "${input}" | ./program`,
      ];
      break;

    case "javascript":
    case "js":
      imageName = "node";
      cmd = [
        "bash",
        "-c",
        `echo "${code.replace(/"/g, '\\"')}" > script.js && node script.js <<EOF\n${input}\nEOF`,
      ];
      break;

    case "php":
      imageName = "php:8.0-cli";
      const sanitizedCode = code
        .replace(/\r\n/g, "\n")
        .replace(/"/g, '\\"')
        .replace(/\$/g, "\\$");
      cmd = [
        "bash",
        "-c",
        `echo "${sanitizedCode}" > /script.php && php /script.php <<EOF\n${input}\nEOF`,
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
      MemLimit: 1000000000,
      CpuShares: 512,
      Volumes: {
        "/tmp": {},
      },
      HostConfig: {
        Binds: ["./tmp:/tmp"],
      },
    });

    await container.start();

    const logs = await new Promise((resolve, reject) => {
      container.logs(
        {
          stdout: true,
          stderr: true,
          follow: true,
          tail: 1000,
        },
        (err, stream) => {
          if (err) {
            reject(err);
          }
          let output = "";
          stream.on("data", (chunk) => {
            output += chunk.toString("utf8");
          });
          stream.on("end", () => {
            resolve(output);
          });
        }
      );
    });
    const out = cleanDockerOutput(logs);
 
    if (out) {
      res.json({ output: out.trim() });
    } else {
      res.status(500).json({ error: "No output from the container" });
    }

    const containerStatus = await container.inspect();
    if (containerStatus.State.Running) {
      await container.stop();
    }

    await container.remove();
  } catch (error) {
    console.error("Error during Docker execution:", error);
    res.status(500).json({
      error: "Failed to execute code",
      details: error.message,
    });
  }
};


function cleanDockerOutput(output) {
  return output.replace(/[\x00-\x1F\x7F]/g, "").trim();
}