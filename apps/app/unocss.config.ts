import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
    transformerCompileClass,
} from "unocss";

export default defineConfig({
    presets: [
        presetAttributify({
            prefix: "uno:",
        }),
        presetUno(),
        presetTypography(),
        presetIcons({
            extraProperties: {
                height: "1.3rem",
                width: "1.3rem",
            },
        }),
    ],
    transformers: [transformerCompileClass()],
});
