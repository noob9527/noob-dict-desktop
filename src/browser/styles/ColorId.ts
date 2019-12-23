// names are copy from [Color customization color id changes](https://github.com/microsoft/vscode/wiki/Color-customization-color-id-changes)
enum ColorId {
  heart = 'heart', // none stable

  background = 'background',
  foreground = 'foreground',

  // input
  input_foreground = 'input.foreground',
  input_background = 'input.background',
  input_border = 'input.border',

  // button
  button_background = 'button.background',

  // tabs
  tab_border = 'tab.border',
  tab_activeForeground = 'tab.activeForeground',
  tab_inactiveForeground = 'tab.inactiveForeground',

  tab_activeBackground = 'tab.activeBackground',
  tab_inactiveBackground = 'tab.inactiveBackground',

  // dropdown
  dropdown_foreground = 'dropdown.foreground',
  dropdown_background = 'dropdown.background',
  dropdown_border = 'dropdown.border',
}

export default ColorId;