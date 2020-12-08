const plugin = require("tailwindcss/plugin");
const _ = require("lodash");
const { colors } = require("tailwindcss/defaultTheme");

const blurs = [
    {
        name: "0",
        value: "none",
    },
    {
        name: "1",
        value: "1px",
    },
    {
        name: "2",
        value: "2px",
    },
    {
        name: "3",
        value: "3px",
    },
    {
        name: "4",
        value: "4px",
    },
    {
        name: "5",
        value: "5px",
    },
];

const sizes = [
    {
        name: "sm",
        value: "0px 0px 2px",
    },
    {
        name: "md",
        value: "0px 0px 4px",
    },
    {
        name: "lg",
        value: "0px 0px 8px",
    },
    {
        name: "xl",
        value: "0px 0px 16px",
    },
    {
        name: "2xl",
        value: "0px 0px 32px",
    },
];

const defaultOptions = {
    variants: ["responsive"],
    utilities: ["drop-shadow", "blur", "backdrop-blur"],
    debug: false,
};

module.exports = plugin.withOptions((options = {}) => {
    return function ({ addUtilities }) {
        options = _.defaults({}, options, defaultOptions);

        const new_utilities = {};
        new_utilities[".filter-0"] = {
            filter: "none",
        };

        if (options.utilities.indexOf("drop-shadow") !== -1) {
            _.merge(new_utilities, getDropShadow());
        }
        if (options.utilities.indexOf("blur") !== -1) {
            _.merge(new_utilities, getBlur());
        }
        if (options.utilities.indexOf("backdrop-blur") !== -1) {
            _.merge(new_utilities, getBackdropBlur());
        }

        if (options.debug === true) {
            console.info(new_utilities);
        }

        addUtilities(new_utilities, {
            variants: options.variants,
        });
    };
});

function getDropShadow() {
    const new_utilities = {};
    new_utilities[".drop-shadow"] = {
        filter:
            "drop-shadow(var(--tw-filter-size, 0px 0px 2px) var(--tw-filter-color, #000000))",
    };

    sizes.forEach((size) => {
        new_utilities[".drop-shadow-" + size.name] = {
            "--tw-filter-size": size.value,
        };
    });
    for (const property in colors) {
        if (typeof colors[property] !== "object") {
            new_utilities[".drop-shadow-" + property] = {
                "--tw-filter-color": colors[property],
            };
            continue;
        }
        for (const item in colors[property]) {
            new_utilities[".drop-shadow-" + property + "-" + item] = {
                "--tw-filter-color": colors[property][item],
            };
        }
    }
    return new_utilities;
}

function getBackdropBlur() {
    const new_utilities = {};
    blurs.forEach((blur) => {
        new_utilities[".backdrop-blur-" + blur.name] = {
            backdropFilter: "blur(" + blur.value + ")",
        };
    });
    return new_utilities;
}

function getBlur() {
    const new_utilities = {};
    blurs.forEach((blur) => {
        new_utilities[".blur-" + blur.name] = {
            filter: "blur(" + blur.value + ")",
        };
    });
    return new_utilities;
}
