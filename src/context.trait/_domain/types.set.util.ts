import { groupBy, map, sum } from 'ramda'

import { TSet, TSetMember } from './types.set.model'

export const createSetModel = (set: TSet) => set
export const createSetMemberModel = (member: TSetMember) => member

export const parseSet = (opts: { set: string }) => {
    const members = opts.set.split(/[\r\n]+/g)
    const multiplicityByMember = map(
        (multiplicity) => multiplicity!.length,
        groupBy((member) => member, members) as Record<string, string[]>
    )

    const isMultiset = Object.values(multiplicityByMember).some(
        (multiplicity) => multiplicity > 1
    )

    return createSetModel({
        members: members.map((member) =>
            createSetMemberModel({
                value: member,
                multiplicity: multiplicityByMember[member],
            })
        ),
        cardinality: sum(Object.values(multiplicityByMember)),
        isMultiset,
    })
}
