import { execSync } from "child_process";
import * as fs from "fs";
import path from "path";
import openapiTS from "openapi-typescript";

const dest = "build";

fs.readdirSync("./openapi/services").forEach((service) => {
  console.log(`BUNDLING SERVICE: ${service}\n`);
  const js = require(`../openapi/services/${service}/openapi.ts`).default;

  fs.mkdirSync(path.join(__dirname, `../${dest}`), { recursive: true });

  const jsonPath = `${dest}/${service}Openapi.json`;
  fs.writeFileSync(
    path.join(__dirname, "..", jsonPath),
    JSON.stringify(js, null, 2)
  );

  console.log(`BUILDING SERVICE: ${service}\n`);
  execSync(`
    redoc-cli build --options.sortTagsAlphabetically=true "${jsonPath}" -o "${jsonPath.replace(
    ".json",
    ".html"
  )}"
  `);

  console.log(`GENERATING SERVICE TYPES: ${service}\n`);
  execSync(`
    openapi-typescript ${jsonPath} --output ${jsonPath.replace(".json", ".ts")}
  `);
});
