import Color from 'color'
import ColorId from '../styles/ColorId'

export const dark = {}

dark[ColorId.background] = Color('#1E1E1E')
dark[ColorId.foreground] = Color('#D4D4D4')

// word
dark[ColorId.word_link] = Color('#f9690e')
dark[ColorId.word_highlight] = Color('rebeccapurple').lighten(0.5)

// input
dark[ColorId.input_foreground] = Color('#D4D4D4')
dark[ColorId.input_background] = Color('#3C3C3C')
dark[ColorId.input_disableBackground] =
  dark[ColorId.input_background]?.fade(0.5)
dark[ColorId.input_border] = dark[ColorId.input_background]

// button
dark[ColorId.button_background] = Color('rebeccapurple')
dark[ColorId.button_hoverBackground] =
  dark[ColorId.button_background]?.darken(0.2)
dark[ColorId.button_foreground] = Color('white')

// tabs
dark[ColorId.tab_border] = null
dark[ColorId.tab_activeForeground] = Color('#FFFFFF')
dark[ColorId.tab_inactiveForeground] =
  dark[ColorId.tab_activeForeground]?.fade(0.5)

dark[ColorId.tab_activeBackground] = dark[ColorId.background]
dark[ColorId.tab_inactiveBackground] = Color('#2D2D2D')

// dropdown
dark[ColorId.dropdown_foreground] = Color('#F0F0F0')
dark[ColorId.dropdown_background] = Color('#3C3C3C')
dark[ColorId.dropdown_border] = Color('#D4D4D4')

// list
// dark[ColorId.list_activeSelectionBackground] = Color('#094771');
// dark[ColorId.list_activeSelectionForeground] = Color('#3C3C3C');
dark[ColorId.list_hoverBackground] = Color('rebeccapurple')
dark[ColorId.list_hoverForeground] = Color('#D4D4D4')

// non stable
dark[ColorId.heart] = Color('#eb2f96')

Object.keys(dark).forEach((e) => (dark[e] = dark[e]?.toString()))
