const fs = require("fs");
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const CleanCSS = require("clean-css");

function buildDistFile() {
    return new Promise((resolve, reject) => {
        return postcss([
            tailwind({
                plugins: [
                    require("../src/index.js")({
                        variants: ["responsive"],
                        utilities: ["drop-shadow", "blur", "backdrop-blur", "bg-blur"],
                        debug: true,
                        export: true,
                    }),
                ],
            }),
            require("autoprefixer"),
        ])
            .process(
                `
@tailwind base;
@tailwind components;
@tailwind utilities;
      `,
                {
                    from: undefined,
                    to: `./dist/tailwind-ui.css`,
                    map: { inline: false },
                }
            )
            .then((result) => {
                fs.writeFileSync(`./dist/tailwind-filters.css`, result.css);
                return result;
            })
            .then((result) => {
                const minified = new CleanCSS().minify(result.css);
                fs.writeFileSync(
                    `./dist/tailwind-filters.min.css`,
                    minified.styles
                );
            })
            .then(resolve)
            .catch((error) => {
                console.log(error);
                reject();
            });
    });
}

console.info("Compiling build...");

Promise.all([buildDistFile()]).then(() => {
    console.log("Finished.");
});
