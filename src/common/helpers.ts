export function convertArrayToMap<T extends { id: string | number }>(arr: T[]): { [key: string]: T } {
    return arr.reduce((current, e) => ({ ...current, [e.id]: e }), {});
}