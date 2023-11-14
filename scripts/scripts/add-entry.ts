import path from 'node:path';
import { __root } from "../server/utilities/env.ts";

export const runEntryPrompt = () => {
    const input = prompt('File name (relative to client/entries):');

    if (!input) {
        console.error('No file name provided');
        Deno.exit(1);
    }
    
    addEntry(input);
};

export const addEntry = (name: string) => {
    const filepath = path.resolve(__root, 'client', 'entries', name + '.ts');
    const dir = path.dirname(filepath);

    // try {
        Deno.mkdirSync(dir, { recursive: true });
    // } catch {}

    const importsRelative = path.relative(
        dir,
        path.resolve(__root, 'client', 'utilities', 'imports')
    );

    const imports = `import '${importsRelative}';`;

    Deno.writeFileSync(filepath, new TextEncoder().encode(imports));
};

if (Deno.args.includes('prompt')) runEntryPrompt();