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

export function GroupBy<T>(xs: T[], keySelector: (item: T) => any) {
    return xs.reduce((currentSet: any, currentItem) => {
        const key = keySelector(currentItem);
        (currentSet[key] = currentSet[key] || []).push(currentItem);
        return currentSet;
    }, {});
}

// https://stackoverflow.com/questions/1960473
export function Distinct<T>(array: T[]): T[] {
    return array.filter((value, index, self) => self.indexOf(value) === index);
}

/**
 * Transforms an array of type `readonly A[] | readonly B[]` into `readonly (A | B)[]`.
 * This is a typing trick only, the exact same array is returned.
 */
export function UnionOfArraysToArrayOfUnions<T>(arr: readonly T[]): readonly T[];
export function UnionOfArraysToArrayOfUnions<T>(arr: T[]): T[];
export function UnionOfArraysToArrayOfUnions<T>(arr: T[] | readonly T[]) { return arr; }
