import { addTemplate, addVitePlugin, createResolver, defineNuxtModule, hasNuxtModule, installModule } from "@nuxt/kit";
import defu from "defu";
import fg from "fast-glob";

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

        const assetsDir = resolve("./runtime/assets");
        const filesInAssetsDir = await fg("**/*", { cwd: assetsDir });
        await Promise.all(filesInAssetsDir.map((file) => {
            return addTemplate({
                src: resolve(assetsDir, file),
                filename: `nebula-ui/assets/${file}`,
                write: true,
            });
        }));

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
