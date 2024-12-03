import { addPlugin, addVitePlugin, createResolver, defineNuxtModule } from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: "@xash/nebula-ui",
        configKey: "nebula",
    },
    // Default configuration options of the Nuxt module
    defaults: {},
    setup: async (_options, nuxt) => {
        const resolver = createResolver(import.meta.url);

        nuxt.options.alias["#nebula-ui"] = resolver.resolve("./runtime");

        if (nuxt.options.builder === "@nuxt/vite-builder") {
            const plugin = await import("@tailwindcss/vite").then(r => r.default);
            addVitePlugin(plugin());
        } else {
            nuxt.options.postcss.plugins["@tailwindcss/postcss"] = {};
        }

        // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
        addPlugin(resolver.resolve("./runtime/plugin"));
    },
});
