export default function elementFromHtmlString(html: string): Element | null {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}
