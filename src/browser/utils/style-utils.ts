import logger from '../../common/utils/logger';

export {
  removeNormalizeStyle
}

/**
 * we have to remove normalize style to create a transparent window
 */
function removeNormalizeStyle() {
  const res = Array.from(document.querySelectorAll('style'));
  const normalizeStyle = res.find(e => isNormalizeStyle(e.innerText));
  if (normalizeStyle) {
    logger.log('normalize css removed');
    normalizeStyle.parentNode?.removeChild(normalizeStyle);
  }
}

function isNormalizeStyle(text: String): boolean {
  const t = `
html,
body {
  width: 100%;
  height: 100%;
}`;
  return text.includes(t);
}
