export {
  injectSuppressErrorScript
};


function textToDom(text: string): Document {
  return new DOMParser().parseFromString(text, 'text/html');
}

function injectScript(script: string, html: string): string {
  const doc = textToDom(html);
  const $head = doc.querySelector('head')!;
  const $script = doc.createElement('script');
  const $inlineScript = doc.createTextNode(script);
  $script.appendChild($inlineScript);
  $head.prepend($script);
  return doc.documentElement.outerHTML;
}

const suppressAllError = `
window.onerror = e => {
  console.debug(e);
  return true;
}
`;

function injectSuppressErrorScript(html: string): string {
  return injectScript(suppressAllError, html);
}