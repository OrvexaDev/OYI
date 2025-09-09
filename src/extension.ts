import * as vscode from 'vscode';
import { resolveContext, pickWorkspaceFolder, pickFromCandidates, scanAggregators, scanProjects, OpenKind, detectProjectFromActiveFile } from './lib/detectors';
import { launchInIde } from './lib/launcher';

let statusItem: vscode.StatusBarItem | undefined;

export async function activate(ctx: vscode.ExtensionContext) {
  const cfg = () => vscode.workspace.getConfiguration();
  const enabled = cfg().get<boolean>('oyi.statusBar.enable', true);
  const priority = cfg().get<number>('oyi.statusBar.priority', 1000);

  // Status Bar Item
  statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, priority);
  statusItem.text = '$(rocket) Open in IDE';
  statusItem.tooltip = 'Abrir IDE · Auto (Alt=Tudo, Ctrl/Cmd=Projeto)'; // doc: nota — modificadores não são capturados no click
  (statusItem as any).ariaLabel = 'Open in IDE, status bar';
  statusItem.command = 'oyi.openFromStatusBar';

  const refreshVisibility = () => {
    const hasWs = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0;
    if (enabled && hasWs) statusItem?.show();
    else statusItem?.hide();
  };

  const updateTooltip = () => {
    const mode = cfg().get<string>('oyi.statusBar.mode', 'auto');
    statusItem!.tooltip = `Abrir IDE · ${mode.toUpperCase()} (Alt=Tudo, Ctrl/Cmd=Projeto)`;
  };

  refreshVisibility();
  updateTooltip();

  ctx.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => refreshVisibility()),
    vscode.window.onDidChangeActiveTextEditor(() => updateTooltip()),
    vscode.workspace.onDidCreateFiles(() => updateTooltip()),
    vscode.workspace.onDidDeleteFiles(() => updateTooltip()),
    vscode.workspace.onDidRenameFiles(() => updateTooltip())
  );

  // Comandos
  ctx.subscriptions.push(
    vscode.commands.registerCommand('oyi.openFromStatusBar', async () => {
      await handleOpen('fromStatusBar');
    }),
    vscode.commands.registerCommand('oyi.openAll', async () => {
      await handleOpen('forceAll');
    }),
    vscode.commands.registerCommand('oyi.openSingle', async () => {
      await handleOpen('forceSingle');
    })
  );
}

export function deactivate() {
  statusItem?.dispose();
}

type Source = 'fromStatusBar' | 'forceAll' | 'forceSingle';

async function handleOpen(source: Source) {
  const cfg = vscode.workspace.getConfiguration('oyi');
  const modePref = cfg.get<'auto'|'all'|'single'|'ask'>('statusBar.mode', 'auto');

  const telemetry = cfg.get<boolean>('statusBar.showTelemetry', false);
  const log = (m: string) => telemetry && vscode.window.setStatusBarMessage(`[OYI] ${m}`, 1500);

  try {
    // 1) workspace
    let ws = resolveContext();
    if (!ws) {
      const picked = await pickWorkspaceFolder('Selecione um workspace para continuar');
      if (!picked) return; // cancel
      ws = picked;
    }

    // 2) decidir modo
    let kind: OpenKind | 'ask';
    if (source === 'forceAll') kind = 'all';
    else if (source === 'forceSingle') kind = 'single';
    else kind = modePref;

    // Spinner curto
    const spinner = vscode.window.setStatusBarMessage('$(sync~spin) Abrindo na IDE…');
    const info = (msg: string) => vscode.window.showInformationMessage(msg);

    if (kind === 'ask') {
      const choice = await vscode.window.showQuickPick(
        [
          { label: '$(gear) Auto', value: 'auto' },
          { label: '$(folder-library) Abrir Tudo (Solução/Workspace/Grupo)', value: 'all' },
          { label: '$(folder) Abrir Projeto Único', value: 'single' }
        ],
        { placeHolder: 'Como deseja abrir?' }
      );
      if (!choice) { spinner.dispose(); return; }
      kind = choice.value as OpenKind | 'auto';
    }

    // 3) Modo Auto => tenta projeto ativo, senão agregadores
    if (kind === 'auto') {
      const projFromActive = await detectProjectFromActiveFile(ws);
      if (projFromActive) {
        log?.('Auto → Projeto Único (arquivo ativo é marcador de projeto)');
        await launchInIde(projFromActive.uri, 'single');
        spinner.dispose();
        info(`Abrindo projeto: ${projFromActive.label}`);
        return;
      }
      kind = 'all';
      log?.('Auto → Abrir Tudo (sem marcador de projeto no editor)');
    }

    if (kind === 'single') {
      // procura projeto mais próximo do arquivo ativo; se não houver, escaneia
      const proj = await detectProjectFromActiveFile(ws) ?? (await scanProjects(ws)).bestGuess;
      if (!proj) {
        spinner.dispose();
        vscode.window.showWarningMessage('Nenhum arquivo de projeto encontrado neste workspace.');
        return;
      }
      spinner.dispose();
      await launchInIde(proj.uri, 'single');
      vscode.window.showInformationMessage(`Abrindo projeto: ${proj.label}`);
      return;
    }

    if (kind === 'all') {
      const aggs = await scanAggregators(ws);
      if (aggs.candidates.length === 1) {
        spinner.dispose();
        await launchInIde(aggs.candidates[0].uri, 'all');
        vscode.window.showInformationMessage(`Abrindo: ${aggs.candidates[0].label}`);
        return;
      }
      if (aggs.candidates.length > 1) {
        spinner.dispose();
        const picked = await pickFromCandidates(aggs.candidates, 'Selecione o agregador para abrir');
        if (!picked) return;
        await launchInIde(picked.uri, 'all');
        vscode.window.showInformationMessage(`Abrindo: ${picked.label}`);
        return;
      }
      // nenhum agregador — abre pasta raiz
      spinner.dispose();
      await launchInIde(ws.uri, 'all');
      vscode.window.showInformationMessage(`Abrindo pasta raiz: ${ws.name}`);
      return;
    }

    spinner.dispose();
  } catch (err: any) {
    vscode.window.showErrorMessage(`Falha ao abrir na IDE: ${err?.message ?? String(err)}`);
  }
}
