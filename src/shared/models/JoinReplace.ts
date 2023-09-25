/**
 * Replaces a property with a new type.
 * When the property is a foreign key ending with "Id", the new type is missing the "Id" suffix.
 */
type JoinReplace<T,
    K extends keyof T & string,
    V
> = Omit<T, K> & { [P in K extends `${infer Prefix}Id` ? Prefix : K]: V }

export default JoinReplace
