import { IQueryable } from "./IQueryable"
import { Uncommitted } from "./Uncommitted"

export interface DbSet<TBase, TStrParams extends keyof TBase, TNumParams extends keyof TBase, TDateParams extends keyof TBase> {
    Where: () => IQueryable<TBase, TStrParams, TNumParams, TDateParams>,
    Add: (rec: TBase) => void,
    Remove: (rec: TBase) => void,
    Update: (rec: TBase) => void,
    Changes: Uncommitted<TBase>[],
}