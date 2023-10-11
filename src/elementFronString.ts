export default function elementFromHtmlString(html: string): Element | null {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}
export function elementFromHtmlStringWithMultipleChildren(
  html: string
): NodeList | null {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.childNodes;
}
