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

export const capitalize = (s: string) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

export const truncateDecimal = (num: number): string => {
    if((num - Math.floor(num)) !== 0) // has decimal
        return (Math.floor(num * 100) / 100).toFixed(2)
    else
        return num.toString()
}