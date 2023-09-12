type GroupedObject<T extends object, K extends keyof T> = { group: T[K], values: T[] }

function groupObjects<T extends object, K extends keyof T>(key: K, ...objects: T[]): GroupedObject<T, K>[] {
    const groupedObjects: GroupedObject<T, K>[] = []

    objects.forEach(object => {
        const group = object[key]
        const groupObject = groupedObjects.find(groupedObject => groupedObject.group === group)

        if (groupObject) {
            groupObject.values.push(object)
        } else {
            groupedObjects.push({group, values: [object]})
        }
    })

    return groupedObjects
}

export default groupObjects
