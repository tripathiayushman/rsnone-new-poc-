// Copies the embedded web build (../rsn-one-poc/dist-embedded) into the native Android
// project's assets so the WebView can load it from file:///android_asset/www/.
// Run AFTER `expo prebuild --platform android` and BEFORE `gradlew assembleRelease`.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const SRC = here('../../rsn-one-poc/dist-embedded/');
const DEST = here('../android/app/src/main/assets/www/');

if (!existsSync(SRC)) {
  console.error(`Missing ${SRC} — run \`npm run build:embedded\` in rsn-one-poc first.`);
  process.exit(1);
}
if (!existsSync(here('../android/'))) {
  console.error('Missing android/ — run `npx expo prebuild --platform android` first.');
  process.exit(1);
}
rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });
cpSync(SRC, DEST, { recursive: true });
console.log(`Embedded web build → ${DEST}`);
