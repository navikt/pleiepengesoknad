export const removeElementFromArray = (element: any, array: any[]) => array.filter((el) => el !== element);

export const mergeWithArray = (element: any, array: any[]) => {
    const index = array.indexOf(element);
    if (index >= 0) {
        array[index] = element;
        return array;
    }
    array.push(element);
    return array;
};
