import { addVitePlugin, createResolver, defineNuxtModule, hasNuxtModule, installModule } from "@nuxt/kit";
import defu from "defu";

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: "nebula-ui",
        configKey: "nebula",
    },
    setup: async (options, nuxt) => {
        const { resolve } = createResolver(import.meta.url);

        nuxt.options.nebula = options;
        nuxt.options.alias["#nebula-ui"] = resolve("./runtime");

        if (nuxt.options.builder === "@nuxt/vite-builder") {
            const plugin = await import("@tailwindcss/vite").then(r => r.default);
            addVitePlugin(plugin());
        } else {
            nuxt.options.postcss.plugins["@tailwindcss/postcss"] = {};
        }

        async function registerModule(name: string, options: Record<string, any>) {
            if (!hasNuxtModule(name)) {
                await installModule(name, options);
            } else {
                (nuxt.options as any)[name] = defu((nuxt.options as any)[name], options);
            }
        }

        await registerModule("@nuxt/icon", {
            cssLayer: "components",
            provider: "server",
            customCollections: [
                {
                    prefix: "nova-icon",
                    dir: resolve("./runtime/assets/icons"),
                },
            ],
        });
        await registerModule("@nuxt/fonts", { experimental: { processCSSVariables: true } });
        await registerModule("@nuxtjs/color-mode", { classSuffix: "", disableTransition: true });
    },
});
