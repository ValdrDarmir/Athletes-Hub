import {where} from "firebase/firestore";
import {WhereFilterOp} from "@firebase/firestore";

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`

type DotNestedKeys<T> = T extends ( Date | Function | Array<any>) ? "" :
        (T extends object ?
            { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
            : "") extends infer D ? Extract<D, string> : never;


/**
 * A typed version of firebase's where function to avoid wrong paths
 * @param fieldPath
 * @param opStr
 * @param value
 */
function whereTyped<T = void>(fieldPath: T extends void ? "You must provide a type parameter" : DotNestedKeys<T>, opStr: WhereFilterOp, value: unknown) {
    return where(fieldPath, opStr, value)
}

export default whereTyped
