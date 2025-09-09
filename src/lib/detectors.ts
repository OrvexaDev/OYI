import * as vscode from 'vscode';
import * as path from 'path';

export type OpenKind = 'auto' | 'all' | 'single';

export interface Candidate {
  label: string;
  description?: string;
  uri: vscode.Uri;
}

export function resolveContext(): vscode.WorkspaceFolder | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return undefined;

  const active = vscode.window.activeTextEditor?.document?.uri;
  if (active) {
    const ws = vscode.workspace.getWorkspaceFolder(active);
    if (ws) return ws;
  }
  return folders[0];
}

export async function pickWorkspaceFolder(placeHolder = 'Selecione uma pasta do workspace'): Promise<vscode.WorkspaceFolder | undefined> {
  const folders = vscode.workspace.workspaceFolders ?? [];
  if (folders.length === 0) return undefined;
  if (folders.length === 1) return folders[0];

  const items = folders.map(f => ({ label: f.name, description: f.uri.fsPath, ws: f }));
  const picked = await vscode.window.showQuickPick(items, { placeHolder });
  return picked?.ws;
}

export async function pickFromCandidates(cands: Candidate[], placeHolder: string) {
  const picked = await vscode.window.showQuickPick(
    cands.map(c => ({ label: c.label, description: c.description, c })),
    { placeHolder }
  );
  return picked?.c;
}

export async function detectProjectFromActiveFile(ws: vscode.WorkspaceFolder): Promise<Candidate | undefined> {
  const active = vscode.window.activeTextEditor?.document?.uri;
  if (!active) return undefined;
  if (!active.fsPath.toLowerCase().startsWith(ws.uri.fsPath.toLowerCase())) return undefined;

  const cfg = vscode.workspace.getConfiguration('oyi');
  const globs = cfg.get<string[]>('statusBar.projectGlobs', []);
  const dirs = ascendDirectories(path.dirname(active.fsPath), ws.uri.fsPath);
  for (const dir of dirs) {
    const hits = await vscode.workspace.findFiles(
      new vscode.RelativePattern(vscode.Uri.file(dir), globsToOrPattern(globs)),
      '**/node_modules/**',
      1
    );
    if (hits.length > 0) {
      const first = hits[0];
      return {
        label: rel(ws.uri, first),
        description: path.dirname(rel(ws.uri, first)),
        uri: vscode.Uri.file(path.dirname(first.fsPath))
      };
    }
  }
  return undefined;
}

export async function scanAggregators(ws: vscode.WorkspaceFolder): Promise<{ candidates: Candidate[] }> {
  const cfg = vscode.workspace.getConfiguration('oyi');
  const globs = cfg.get<string[]>('statusBar.aggregatorGlobs', []);
  const files = await vscode.workspace.findFiles(
    new vscode.RelativePattern(ws, globsToOrPattern(globs)),
    '**/node_modules/**',
    200
  );

  const cands: Candidate[] = files.map(f => ({
    label: rel(ws.uri, f),
    description: path.dirname(rel(ws.uri, f)),
    uri: f
  }));
  cands.sort((a, b) => scoreAggregator(b.label) - scoreAggregator(a.label));
  return { candidates: cands };
}

export async function scanProjects(ws: vscode.WorkspaceFolder): Promise<{ bestGuess?: Candidate, all: Candidate[] }> {
  const cfg = vscode.workspace.getConfiguration('oyi');
  const globs = cfg.get<string[]>('statusBar.projectGlobs', []);
  const files = await vscode.workspace.findFiles(
    new vscode.RelativePattern(ws, globsToOrPattern(globs)),
    '**/node_modules/**',
    400
  );
  const cands: Candidate[] = files.map(f => ({
    label: rel(ws.uri, f),
    description: path.dirname(rel(ws.uri, f)),
    uri: vscode.Uri.file(path.dirname(f.fsPath))
  }));
  cands.sort((a, b) => depth(a.label) - depth(b.label));
  return { bestGuess: cands[0], all: cands };
}

function rel(root: vscode.Uri, child: vscode.Uri) {
  return path.posix.normalize(
    child.path.replace(root.path.endsWith('/') ? root.path : root.path + '/', '')
  );
}

function globsToOrPattern(globs: string[]) {
  const cleaned = globs.map(g => g.trim()).filter(Boolean);
  return `{${cleaned.join(',')}}`;
}

function ascendDirectories(start: string, stopAtInclusive: string): string[] {
  const list: string[] = [];
  let cur = path.resolve(start);
  const stop = path.resolve(stopAtInclusive);
  while (cur.startsWith(stop)) {
    list.push(cur);
    const next = path.dirname(cur);
    if (next === cur) break;
    cur = next;
  }
  return list;
}

function depth(p: string) {
  return p.split(/[\\/]/g).length;
}

function scoreAggregator(label: string) {
  const l = label.toLowerCase();
  if (l.endsWith('.sln') || l.endsWith('.slnf')) return 100;
  if (l.endsWith('pnpm-workspace.yaml')) return 90;
  if (l.endsWith('package.json')) return 80;
  if (l.endsWith('lerna.json') || l.endsWith('turbo.json') || l.endsWith('nx.json') || l.endsWith('rush.json')) return 75;
  if (l.endsWith('cmakelists.txt') || l.endsWith('.cmake') || l.endsWith('makefile')) return 70;
  if (l.endsWith('.xcworkspace') || l.endsWith('.xcodeproj') || l.endsWith('.uproject')) return 60;
  return 10;
}
