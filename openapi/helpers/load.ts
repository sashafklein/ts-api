import * as fs from "fs";
import yaml from "js-yaml";
import path from "path";

export const load = (filePath) => {
  const ext = filePath.split("/").reverse()[0].split(".")[1];
  if (ext === "ts") {
    return require(filePath.replace(".ts", "")).default;
  } else {
    const string = fs.readFileSync(filePath).toString();
    if (["yaml", "yml"].includes(ext)) {
      return yaml.load(string);
    } else if ("json" === ext) {
      return JSON.parse(string);
    } else {
      throw new Error(`Cannot load file: ${filePath}`);
    }
  }
};

export const loadAllInDir = (dirname): Record<string, any> => {
  const contents = {};
  const dir = path.join(dirname, "./");
  fs.readdirSync(dir)
    .filter((n) => n !== "index.js")
    .forEach((file) => {
      const filePath = path.join(dirname, file);
      contents[file.split(".")[0]] = load(filePath);
    });
  return contents;
};
