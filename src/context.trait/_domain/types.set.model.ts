export type TSetMember<T> = {
    value: T
    multiplicity: number
}
export type TSet<T> = {
    members: TSetMember<T>[]
    cardinality: number
    isMultiset: boolean
}
