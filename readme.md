# Bun runtime plugin `onResolve` sync versus async `import`

This repository reproduces an apparent bug in the Bun runtime plugin `onResolve`
method implemenation when it comes to synchronous and asychronous module
imports.

Start off by running `bun install` to fetch the TypeScript types for Bun.

Next up, check the runtime plugin implementation in `plugin.ts`.
You can see it uses `onResolve` to re-map an import specifier to a different
path (`./sync.demo` to `./sync.ts` and `./async.demo` to `./async.ts`).

`bunfig.toml`'s `preload` is used to register the plugin.

Run `bun index.ts` to see the plugin in action.
It will print a line showing the plugin is successfully registered.
There are two imports, one synchronous and another, asynchronous.
We'll see two more lines showing `onResolve` is called for the sync path and
then the default export printing correctly.
After, we see another `onResolve` call, but this time, the load fails with an
`ENOENT` error despite `async.ts` existing.

```
Plugin loaded
onResolve called ./sync.demo
Sync demo Hello, sync!
onResolve called ./async.demo
Error loading async demo error: ENOENT reading "file:./async.ts"
```

We can try to fix this by prepending `import.meta.dir` to `path` in `onResolve`,
but this won't help:

```
Plugin loaded
onResolve called ./sync.demo
Sync demo Hello, sync!
onResolve called ./async.demo
Error loading async demo error: ENOENT reading "file:/…/async.ts"
```

The problem seems to be specific to asynchronous imports.

## Bun GitHub issue

https://github.com/oven-sh/bun/issues/9862

## See also

I have also discovered an issue with `onResolve` not being fired for custom
protocol:

- https://github.com/TomasHubelbauer/bun-runtime-plugin-onResolve-custom-protocol
- https://github.com/oven-sh/bun/issues/9863
