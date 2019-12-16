import Color from 'color';
import ColorId from "../styles/ColorId";

// names are copy from [Color customization color id changes](https://github.com/microsoft/vscode/wiki/Color-customization-color-id-changes)
export const dark = {};

dark[ColorId.background] = Color('#1E1E1E');
dark[ColorId.foreground] = Color('#D4D4D4');

// input
dark[ColorId.input_foreground] = Color('#D4D4D4');
dark[ColorId.input_background] = Color('#3C3C3C');
dark[ColorId.input_border] = null;

// tabs
dark[ColorId.tab_border] = null;
dark[ColorId.tab_activeForeground] = Color('#FFFFFF');
dark[ColorId.tab_inactiveForeground] = dark[ColorId.tab_activeForeground]?.fade(0.5);

dark[ColorId.tab_activeBackground] = dark[ColorId.background];
dark[ColorId.tab_inactiveBackground] = Color('#2D2D2D');

// dropdown
dark[ColorId.dropdown_foreground] = Color('#F0F0F0');
dark[ColorId.dropdown_background] = Color('#3C3C3C');
dark[ColorId.dropdown_border] = Color('#D4D4D4');

// list
// dark[ColorId.list_activeSelectionBackground] = Color('#094771');
// dark[ColorId.list_activeSelectionForeground] = Color('#3C3C3C');
// dark[ColorId.list_hoverBackground] = Color('#F0F0F0');
// dark[ColorId.list_hoverForeground] = Color('#3C3C3C');


Object.keys(dark).forEach(e => dark[e] = dark[e]?.toString());
