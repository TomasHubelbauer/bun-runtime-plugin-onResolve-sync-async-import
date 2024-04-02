import { plugin } from "bun";

await plugin({
  name: "test",
  async setup(build) {
    console.log('Plugin loaded');

    build.onResolve({ filter: /\.demo$/ }, ({ path }) => {
      console.log('onResolve called', path);
      switch (path) {
        case './sync.demo': {
          return { path: './sync.ts' };
        }
        case './async.demo': {
          return { path: './async.ts' };
        }
        default: {
          throw new Error(`Unknown path: ${path}`);
        }
      }
    });
  },
});
