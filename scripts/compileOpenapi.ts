import { execSync } from "child_process";
import * as fs from "fs";
import path from "path";

const dest = "build";

fs.readdirSync("./openapi/services").forEach((service) => {
  console.log(`COMPILING: ${service}`);
  console.log(`- BUNDLING`);
  const jsonPath = `${dest}/${service}Openapi.json`;

  const js = require(`../openapi/services/${service}/openapi.ts`).default;

  fs.mkdirSync(path.join(__dirname, `../${dest}`), { recursive: true });

  fs.writeFileSync(
    path.join(__dirname, "..", jsonPath),
    JSON.stringify(js, null, 2)
  );

  console.log(`- BUILDING`);
  execSync(`
    redoc-cli build --options.sortTagsAlphabetically=true "${jsonPath}" -o "${jsonPath.replace(
    ".json",
    ".html"
  )}"
  `);

  console.log(`- GENERATING TYPES\n`);
  execSync(`
    openapi-typescript ${jsonPath} --output ${jsonPath.replace(".json", ".ts")}
  `);
});
