import { readFileSync } from 'node:fs';

const raw = readFileSync(new URL('../seeds/seedData.json', import.meta.url), 'utf-8');
const data = JSON.parse(raw) as Record<string, unknown>;

console.log('Seed payload prepared for import to Firestore:');
console.log(JSON.stringify(data, null, 2));
console.log('Use Firebase Admin SDK in your deployment environment to upsert this payload.');
