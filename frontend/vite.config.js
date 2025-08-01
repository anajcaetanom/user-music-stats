import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from 'path';
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig(({ mode }) =>  ({
  plugins: [
		react(), svgr(),
    EnvironmentPlugin({all: true, prefix: 'REACT_APP_' }),	
	],
  base: "/",
  build: {
    outDir: "build", // O Vite por padrão gera o build na pasta "dist"
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/context'),
    }
  },
  server: {
    proxy: {
      // proxy all requests starting with /api to localhost:4000
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  },
}));

