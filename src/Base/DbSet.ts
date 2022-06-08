import { IQueryable } from "./IQueryable"
import { Uncommitted } from "./Uncommitted"

export type DbSet<TBase,TStrParams,TNumParams> = {
    Where: () => IQueryable<TBase,TStrParams,TNumParams>,
    Add: (rec : TBase) => void,
    Remove: (rec : TBase) => void,
    Update: (rec : TBase) => void,
    Changes: Uncommitted<TBase>[],
}


// export type DbSet<T> = {
//     Where: () => IQueryable<T>,
//     Add: (rec: T, persistSingle: boolean) => void,
//     Remove: (rec: T, persistSingle: boolean) => void,
//     Update: (rec: T, persistSingle: boolean) => void,
//     Changes: Uncommitted<T>[],
// }
