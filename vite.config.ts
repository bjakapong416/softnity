import { defineConfig, transformWithEsbuild, type Plugin } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * The game is split into ordered files in src/game (00-core.ts … 24-boot.ts).
 * They share one global scope (like the original single <script>), so this plugin
 * concatenates them in order and strips TypeScript with esbuild.
 * Dev: served at /game.js (full reload on change). Build: emitted as dist/game.js.
 * New code can be written as normal ES modules in src/ and migrated step by step.
 */
function softnityGame(): Plugin {
  const dir = resolve(__dirname, 'src/game');
  const bundle = async () => {
    const files = readdirSync(dir).filter(f => /\.(ts|js)$/.test(f)).sort();
    const code = files.map(f => `// ---- ${f} ----\n` + readFileSync(resolve(dir, f), 'utf8')).join('\n');
    const out = await transformWithEsbuild(code, 'game.ts', { loader: 'ts', target: 'es2022', format: undefined });
    return out.code;
  };
  return {
    name: 'softnity-game',
    configureServer(server) {
      server.watcher.add(dir);
      server.watcher.on('change', f => { if (f.startsWith(dir)) server.ws.send({ type: 'full-reload' }); });
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.split('?')[0].endsWith('/game.js')) return next();
        try { res.setHeader('Content-Type', 'application/javascript'); res.end(await bundle()); }
        catch (e) { next(e as Error); }
      });
    },
    async generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'game.js', source: await bundle() });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [softnityGame()],
  build: { outDir: 'dist', emptyOutDir: true, chunkSizeWarningLimit: 2000 },
});
