export const nthItemFilter = (index: number, nth: number): boolean => nth === 1 || index === 0 || index % nth === 0;

export function getEveryNthItemInArray<T>(array: T[], nth: number): T[] {
    return array.filter((_, index) => nthItemFilter(index, nth));
}
