# why change browserslist config in package.json
不知道为什么，在升级到新版 effective-enum 包(1.0.1)后，使用 parcel build main.ts 的时候会有如下报错
```
➜  noob-dict-desktop git:(new) ✗ yarn main:build
yarn run v1.22.15
$ parcel build ./src/electron-main/main.ts --no-source-maps --target electron --out-dir build --out-file main.js --no-minify
⠹ Building main.ts...Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
⠸ Building main.ts...Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
⠼ Building search-window.ts...Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
⠴ Building main-container.ts...Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
⠦ Building tray.ts...Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
⠧ Building tray.ts...Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
⠇ Building social-login.ts...Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
🚨  /Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/src/common/window-id.ts: Cannot resolve dependency '/Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/typeof' at '/Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/typeof'
    at Resolver.resolve (/Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/parcel-bundler/src/Resolver.js:71:17)
    at async Bundler.resolveAsset (/Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/parcel-bundler/src/Bundler.js:433:18)
    at async Bundler.resolveDep (/Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/parcel-bundler/src/Bundler.js:484:14)
    at async /Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/parcel-bundler/src/Bundler.js:608:26
    at async Promise.all (index 2)
    at async Bundler.loadAsset (/Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/parcel-bundler/src/Bundler.js:599:21)
    at async /Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/parcel-bundler/src/Bundler.js:610:13
    at async Promise.all (index 8)
    at async Bundler.loadAsset (/Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/parcel-bundler/src/Bundler.js:599:21)
    at async /Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/parcel-bundler/src/Bundler.js:610:13
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-methods since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-methods", { "loose": true }]
to the "plugins" section of your Babel config.
Though the "loose" option was set to "false" in your @babel/preset-env config, it will not be used for @babel/plugin-proposal-private-property-in-object since the "loose" mode option was set to "true" for @babel/plugin-proposal-class-properties.
The "loose" option must be the same for @babel/plugin-proposal-class-properties, @babel/plugin-proposal-private-methods and @babel/plugin-proposal-private-property-in-object (when they are enabled): you can silence this warning by explicitly adding
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
to the "plugins" section of your Babel config.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```
在修改 browserslist 为如下后
```json
{
  "browserslist": {
    "production": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```
后，错误消失。
修改前的完整 package.json 如下
```json
{
  "name": "noob-dict-desktop",
  "version": "0.0.6",
  "description": "A dictionary aim to help myself learning English",
  "private": true,
  "main": "build/main.js",
  "homepage": "./",
  "repository": "git@github.com:noob9527/noob-dict-desktop.git",
  "author": "noob9527 <2061864@qq.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/noob9527/noob-dict-desktop/issues",
    "email": "2061864@qq.com"
  },
  "scripts": {
    "analyze": "source-map-explorer 'build/static/js/*.js'",
    "lint:fix": "eslint --fix src --ext .ts,.tsx",
    "electron-rebuild": "electron-rebuild install-app-deps",
    "start": "concurrently \"npm run main:start\" \"npm run renderer:start\" \"wait-on http://localhost:3000 && electron .\"",
    "test": "node scripts/test.js --config=config/jest/jest.config.js",
    "build": "npm run renderer:build && npm run main:build && electron-builder build",
    "build:linux": "npm run renderer:build && npm run main:build && electron-builder build --linux",
    "renderer:start": "BROWSER=none node scripts/start.js",
    "renderer:build": "node scripts/build.js",
    "main:start": "parcel watch ./src/electron-main/main.ts --no-source-maps --target electron --out-dir build --out-file main.js",
    "main:build": "parcel build ./src/electron-main/main.ts --no-source-maps --target electron --out-dir build --out-file main.js --no-minify",
    "electron:start": "concurrently \"npm run main:start\" \"wait-on http://localhost:3000 && electron .\"",
    "electron:build": "electron-builder build --publish never",
    "electron:build:mac": "electron-builder build --publish never --mac --x64 --arm64",
    "//": "https://www.electron.build/configuration/publish.html#how-to-publish",
    "release": "electron-builder --publish always",
    "release:mac": "electron-builder --publish always --mac --x64 --arm64"
  },
  "dependencies": {
    "@electron/remote": "^2.0.8",
    "@noob9527/noob-dict-core": "^0.0.1",
    "about-window": "^1.15.0",
    "antd": "^3.26.7",
    "axios": "^0.19.2",
    "bizcharts": "^3.5.5",
    "color": "^3.1.2",
    "connected-react-router": "^6.5.2",
    "dexie": "^2.0.4",
    "effective-enum": "^1.0.0",
    "electron-better-ipc": "^2.0.1",
    "electron-context-menu": "^0.15.0",
    "electron-log": "^4.1.0",
    "electron-store": "^8.0.2",
    "electron-updater": "^5.0.5",
    "history": "^4.10.1",
    "inversify": "^5.0.1",
    "moment": "^2.24.0",
    "react": "^16.10.1",
    "react-dom": "^16.10.1",
    "react-redux": "^7.1.1",
    "react-router-dom": "^5.1.2",
    "react-scrollbar": "^0.5.6",
    "react-split-pane": "^0.1.89",
    "react-tabs": "^3.0.0",
    "redux": "^4.0.4",
    "redux-saga": "^1.1.1",
    "reflect-metadata": "^0.1.13",
    "styled-components": "^4.4.1",
    "typescript": "^3.7.3",
    "uuid": "^7.0.3"
  },
  "devDependencies": {
    "@babel/core": "^7.9.0",
    "@jest-runner/electron": "^2.0.2",
    "@svgr/webpack": "4.1.0",
    "@types/color": "^3.0.0",
    "@types/jest": "24.0.18",
    "@types/lodash": "^4.14.144",
    "@types/node": "12.7.8",
    "@types/react": "16.9.3",
    "@types/react-dom": "16.9.1",
    "@types/react-redux": "^7.1.5",
    "@types/react-router-dom": "^5.1.0",
    "@types/styled-components": "^4.4.1",
    "@typescript-eslint/eslint-plugin": "1.6.0",
    "@typescript-eslint/parser": "1.6.0",
    "babel-eslint": "10.0.1",
    "babel-jest": "^28.1.1",
    "babel-loader": "8.2.5",
    "babel-plugin-import": "^1.12.2",
    "babel-plugin-named-asset-import": "^0.3.2",
    "babel-preset-react-app": "^9.0.0",
    "camelcase": "^5.2.0",
    "case-sensitive-paths-webpack-plugin": "2.2.0",
    "concurrently": "^5.0.0",
    "copy-webpack-plugin": "^5.1.1",
    "cross-env": "^7.0.0",
    "css-loader": "2.1.1",
    "dotenv": "6.2.0",
    "dotenv-expand": "4.2.0",
    "electron": "^19.0.6",
    "electron-builder": "^23.1.0",
    "electron-reload": "^1.5.0",
    "eslint": "^5.16.0",
    "eslint-config-react-app": "^4.0.1",
    "eslint-loader": "2.1.2",
    "eslint-plugin-flowtype": "2.50.1",
    "eslint-plugin-import": "2.16.0",
    "eslint-plugin-jsx-a11y": "6.2.1",
    "eslint-plugin-react": "7.12.4",
    "eslint-plugin-react-hooks": "^1.5.0",
    "file-loader": "3.0.1",
    "fs-extra": "7.0.1",
    "git-revision-webpack-plugin": "^3.0.4",
    "html-webpack-plugin": "4.0.0-beta.5",
    "identity-obj-proxy": "3.0.0",
    "is-wsl": "^1.1.0",
    "jest": "24.7.1",
    "jest-environment-jsdom-fourteen": "0.1.0",
    "jest-resolve": "24.7.1",
    "jest-watch-typeahead": "0.3.0",
    "mini-css-extract-plugin": "0.5.0",
    "optimize-css-assets-webpack-plugin": "5.0.1",
    "parcel-bundler": "^1.12.4",
    "parcel-plugin-electron-dotenv": "^0.1.0",
    "pnp-webpack-plugin": "1.2.1",
    "postcss-flexbugs-fixes": "4.1.0",
    "postcss-loader": "3.0.0",
    "postcss-normalize": "7.0.1",
    "postcss-preset-env": "6.6.0",
    "postcss-safe-parser": "4.0.1",
    "react-app-polyfill": "^1.0.1",
    "react-dev-utils": "^9.0.1",
    "resolve": "1.10.0",
    "sass": "^1.53.0",
    "sass-loader": "10",
    "semver": "6.0.0",
    "source-map-explorer": "^2.1.2",
    "style-loader": "0.23.1",
    "terser-webpack-plugin": "1.2.3",
    "ts-pnp": "1.1.2",
    "url-loader": "1.1.2",
    "wait-on": "^3.3.0",
    "webpack": "4.29.6",
    "webpack-dev-server": "3.2.1",
    "webpack-manifest-plugin": "2.0.4",
    "workbox-webpack-plugin": "4.2.0"
  },
  "resolutions": {
    "//": "See https://github.com/facebook/create-react-app/issues/11773",
    "react-error-overlay": "6.0.9"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "babel": {
    "presets": [
      "react-app"
    ],
    "plugins": []
  }
}
```