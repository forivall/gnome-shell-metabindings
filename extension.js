const Meta = imports.gi.Meta;

const Main = imports.ui.main;

const Utils = imports.misc.extensionUtils.getCurrentExtension().imports.utils; 

const GLib = imports.gi.GLib;

// End of imports.

const mySettings = Utils.getSettings();

const keyBindingCommands = {
	'terminal': 'gnome-terminal',
	// 'nautilus': 'nautilus',
	'nautilus': 'nemo',
	'gedit': ['subl','-n']
};

let keyBindings;

function handlerFactory(command) {
	return function() {
		GLib.spawn_async(null, ["/usr/bin/env"].concat(command),null,0,function(){});
	};
}

function MetaCommands() {
	this.__constructor__.apply(this, arguments); }
MetaCommands.prototype = {
	__constructor__: function() {
		let name;
		this.commands = {};
		for(name in keyBindingCommands) {
			print('constructing handler ' + name);
			this.commands[name] = handlerFactory(keyBindingCommands[name]);
		}
	},
	destroy: function() {
		print('commands destroyed');
	}
}


function init(metadata) {

}

function enable() {
	keyBindings = new MetaCommands();
	let name;
	for(name in keyBindings.commands) {
		print('binding handler ' + name);
		// <= 3.6
		// global.display.add_keybinding(name,
		// >= 3.7/3.8
		Main.wm.addKeybinding(name,
			mySettings,
			Meta.KeyBindingFlags.NONE,

			// >= 3.7/3.8
            Shell.KeyBindingMode.NORMAL
            // |
            // Shell.KeyBindingMode.OVERVIEW
            ,

			keyBindings.commands[name]
		);
	}
}

function disable() {
	print('disable');
	if (keyBindings != null) {
		let name;
		for(name in keyBindings.commands) {
			print('removing handler ' + name);
			global.display.remove_keybinding(name);
		}
		keyBindings.destroy();
		keyBindings = null;
	}
}
