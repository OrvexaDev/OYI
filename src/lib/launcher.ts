import * as vscode from 'vscode';
import type { OpenKind } from './detectors';

export async function launchInIde(target: vscode.Uri, kind: Exclude<OpenKind,'auto'>): Promise<void> {
  // Se o “core” do OYI existir, delega para ele
  const coreCmd = 'oyi.open';
  const hasCore = (await vscode.commands.getCommands(true)).includes(coreCmd);
  if (hasCore) {
    await vscode.commands.executeCommand(coreCmd, { uri: target.toString(), kind });
    return;
  }

  // Fallback: abrir no próprio VS Code (mesmo contexto remoto)
  const stat = await vscode.workspace.fs.stat(target).catch(() => undefined);
  const isFile = !!stat && (stat.type & vscode.FileType.File) === vscode.FileType.File;

  if (isFile) {
    await vscode.window.showTextDocument(target, { preview: false });
  } else {
    await vscode.commands.executeCommand('vscode.openFolder', target, true);
  }
}
