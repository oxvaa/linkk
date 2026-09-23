import fs from 'node:fs';

const app = fs.readFileSync('App.js','utf8');
const service = fs.readFileSync('services/linkBackend.js','utf8')
  .replace(/^import \{ supabase \} from ['"]\.\.\/lib\/supabase['"];?\s*/,'')
  .replace(/^const threadKey = .*\n/m,'')
  .replace(/^const groupThreadKey = .*\n/m,'')
  .replace(/\bexport\s+(?=(async\s+)?function\b|const\b|let\b|var\b)/g,'');
const gate = fs.readFileSync('components/BackendGate.js','utf8')
  .replace(/^import .*$/gm,'')
  .replace('export default function BackendGate','function BackendGate')
  .replace("const ACCENT = '#6C5CE7';",'')
  .replace(/\bstyles\./g,'backendStyles.')
  .replace('const styles = StyleSheet.create(','const backendStyles = StyleSheet.create(')
  .trim();
const supabaseSource = fs.readFileSync('lib/supabase.js','utf8')
  .replace(/^import .*$/gm,'')
  .replace(/\bexport\s+const\s+/g,'const ')
  .trim();

let snack = app
  .replace("import React, { useEffect, useMemo, useRef, useState } from 'react';", "import React, { useEffect, useMemo, useRef, useState } from 'react';\nimport { createClient } from '@supabase/supabase-js';")
  .replace('  Alert,\n','  ActivityIndicator,\n  Alert,\n')
  .replace(/^import BackendGate from ['"]\.\/components\/BackendGate['"];?\n/m,'')
  .replace(/^import \{[\s\S]*?\} from ['"]\.\/services\/linkBackend['"];?\n/m,'');

const marker = "const STORAGE_KEY =";
const insertion = `${supabaseSource}\n\n${service}\n\n${gate}\n\n`;
if (!snack.includes(marker)) throw new Error('STORAGE_KEY marker not found');
snack = snack.replace(marker,insertion+marker);
fs.writeFileSync('App.snack.js',snack);
