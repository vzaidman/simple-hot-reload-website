# simple-hot-reload-website

## Minimum reproduction for


## Launch
1. npm install
2. npm build (even though the build is commited in repo for convenience)
3. npm start

## Result
Hot reload with the `sourcesContent` field in source maps works as expected:
* Every hot reload replaces `helper.js` and the maps reflect the latest state of that file well.
* You can set breakpoints as expected

![](/readme-assets/example-with-sources-content.png)

Conversly, hot reload without the `sourcesContent` field in source maps fails:
* Every hot reload adds a new source map to `helper.js`.
* setting breakpoints, sets a breakpoint for each hot reload

![](/readme-assets/example-no-sources-content.png)
