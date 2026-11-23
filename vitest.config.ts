import { defineConfig } from 'vitest/config';
import parquetPlugin from './parquet-plugin.mjs';

export default defineConfig({
    plugins: [parquetPlugin()],
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['tests/**/*.test.{ts,tsx,js,jsx}'],
    },
});
