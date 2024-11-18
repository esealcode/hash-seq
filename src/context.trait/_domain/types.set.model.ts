export type TSetMember = {
    value: string
    multiplicity: number
}
export type TSet = {
    members: TSetMember[]
    cardinality: number
    isMultiset: boolean
}
