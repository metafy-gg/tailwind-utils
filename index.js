const fs = require("fs");

if (process.argv.length < 3) {
  console.error("error: no input files given");
  return;
}
const inputFiles = process.argv.slice(2);

// TODO: More rules, build RegExp automatically by prepending each possible variant to each entry here.
const classOrder = [
  /hidden/,
  /fixed/,
  /absolute/,
  /flex/,
  /flex-.+/,
  /font-.+/,
  /text-.+/,
  /uppercase/,
  /bg-.+/,
  /bg-opacity-.+/,
  /border/,
  /border-.+/,
  /border-opacity-.+/,
  /rounded-.+/,
  /tracking-.+/,
  /leading-.+/,
  /p-.+/,
  /p[xy]-.+/,
  /p[tblr]-.+/,
  /m-.+/,
  /m[xy]-.+/,
  /m[tblr]-.+/,
];
const classRe = /class="(([\w-:/]+ ?)+)/g;

// TODO: Export this function and make it available for general use, use it in our figma-tailwind project.
function sortClasses(classes) {
  return classes
    .split(" ")
    .sort((a, b) => {
      return (
        classOrder.findIndex((re) => a.match(re)) -
        classOrder.findIndex((re) => b.match(re))
      );
    })
    .join(" ");
}

// TODO: Make it work as a Prettier plugin
for (const file of inputFiles) {
  const data = fs.readFileSync(file).toString();
  const dataSorted = data.replace(classRe, (_, classes) => {
    return 'class="'+sortClasses(classes);
  });
  fs.writeFileSync(file.split(".svelte")[0] + ".sorted.svelte", dataSorted);
}
