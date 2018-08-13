export function AddStyleText(text: string) {
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.type = 'text/css';
    if ((style as any).styleSheet) {
        (style as any).styleSheet.cssText = text;
    } else {
        style.appendChild(document.createTextNode(text));
    }
    head.appendChild(style);
}
