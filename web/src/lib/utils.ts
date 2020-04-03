import { Instructions } from "./interfaces"

export const getKeyByValue = (object: any, value: any): string | undefined => Object.keys(object).find(key => object[key] === value)

export const getEnumNames = (enums: any): string[] => {
    return Object.keys(enums).filter((key: string | number | any) => !isNaN(Number(enums[key]))).map((key: string | any) => key)
}

// export const iterateEnum = (enumObj: any): {key: string, value: any}[] => {
//     return Object.keys(enumObj).map(key => ({key, value: enumObj[key]}))
// }

export const createMarkup = (markup: string): { __html: string } => ({ __html: markup })

export const convertToJSON = (stringifiedContent: string): Instructions => JSON.parse(stringifiedContent)

