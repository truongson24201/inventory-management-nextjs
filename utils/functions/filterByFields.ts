export interface IItem {
    [key: string]: string | number
}

export default function filterByFields(
    list: IItem[], 
    filterValue: string,
    filterFields: string[]
): IItem[] {
    const len = filterFields.length;

    return list.filter(item => {
        for (let i = 0; i < len; i++) {
            const field = filterFields[i];
            if (item[field].toString().toLowerCase()
                .includes(filterValue.toLowerCase()))
                return true;
        }
        return false;
    });
}

export function toIndexSignature(list: any[]): IItem[] {
    return list.map(item => item as IItem)
}