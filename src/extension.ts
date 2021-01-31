// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { runInContext } from 'vm';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let run = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	run.text = "$(debug-start) Load into toplevel"
	run.command = "ocaml-toplevel-loader.loadIntoToplevel"
	run.show();
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ocaml-toplevel-loader" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json


	let load = vscode.commands.registerCommand('ocaml-toplevel-loader.loadIntoToplevel', () => {
		if (vscode.window.activeTextEditor === undefined){
			vscode.window.showErrorMessage("Error, you must use a .ml file for this command.")
			return;
		}
		let file = vscode.window.activeTextEditor?.document.fileName;
		if (!(file?.endsWith(".ml") || file === undefined)){
			vscode.window.showErrorMessage("Error, you must use a .ml file for this command.")
			return;
		}
		file = file.replace(/[\\]/g, "\\$&")
		let currentTerminal = vscode.window.activeTerminal;
		if (currentTerminal === undefined){
			let terminal = vscode.window.createTerminal('ocamlrun');
			terminal.show()
			terminal.sendText("ocaml");
				setTimeout(() => {
					if (terminal === undefined) {
						return;
					}
					terminal.sendText("#use \"" + file + "\";;")}, 1000)
			return;
		}
		let name = currentTerminal.name;
		let b = name.includes("opam") || name.includes("ocaml")
		currentTerminal.show()
		if (!b){
			currentTerminal.sendText("ocaml");
			setTimeout(() => {
				if (currentTerminal === undefined) {
					return;
				}
				currentTerminal.sendText("#use \"" + file + "\";;")}, 1000)
			}else{
				currentTerminal.sendText("#use \"" + file + "\";;")
			}
		});
	context.subscriptions.push(load);
}

// this method is called when your extension is deactivated
export function deactivate() {}
