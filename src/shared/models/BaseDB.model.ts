/**
 * A base model class that all other database models will inherit from.
 */
interface BaseDBModel {
    id: string
    createdAt: Date
    updatedAt: Date
}

export default BaseDBModel
