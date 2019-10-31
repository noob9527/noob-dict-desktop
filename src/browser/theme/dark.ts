import Color from 'color';

// names are copy from [Color customization color id changes](https://github.com/microsoft/vscode/wiki/Color-customization-color-id-changes)
export const dark = {};

dark["background"] = Color('#1E1E1E');
dark["foreground"] = Color('#D4D4D4');

// input
dark["input.foreground"] = Color('#D4D4D4');
dark["input.background"] = Color('#3C3C3C');
dark["input.border"] = null;

// tabs
dark["tab.border"] = null;
dark["tab.activeForeground"] = Color('#FFFFFF');
dark["tab.inactiveForeground"] = dark["tab.activeForeground"]?.fade(0.5);

dark["tab.activeBackground"] = dark["background"];
dark["tab.inactiveBackground"] = Color('#2D2D2D');

// dropdown
dark["dropdown.foreground"] = Color('#F0F0F0');
dark["dropdown.background"] = Color('#3C3C3C');
dark["dropdown.border"] = Color('#D4D4D4');

// list
// dark["list.activeSelectionBackground"] = Color('#094771');
// dark["list.activeSelectionForeground"] = Color('#3C3C3C');
// dark["list.hoverBackground"] = Color('#F0F0F0');
// dark["list.hoverForeground"] = Color('#3C3C3C');


Object.keys(dark).forEach(e => dark[e] = dark[e]?.toString());
