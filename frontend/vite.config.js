import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
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
	define: {	
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));

