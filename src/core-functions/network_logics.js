export const getSCAssignedWithTheseFMs = (FMList, allSubcatchments) => {
    return allSubcatchments.filter((item, index) => FMList.includes(item.user_text_10) )
}
