export const getKeyByValue = (object: any, value: any): string | undefined => Object.keys(object).find(key => object[key] === value)

export const getEnumNames = (enums: any): string[] => {
    return Object.keys(enums).filter((key: string | number | any) => !isNaN(Number(enums[key]))).map((key: string | any) => key)
}