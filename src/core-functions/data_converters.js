export const getSCValuesAsArrayForTable = (subData) => {
    return subData.map((item) => Object.keys(item).map((key) => item[key]))
}