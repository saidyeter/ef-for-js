import { IQueryable } from "./IQueryable"
import { Uncommitted } from "./Uncommitted"

export interface DbSet<TBase, TStrParams extends keyof TBase | Empty, TNumParams extends keyof TBase | Empty, TDateParams extends keyof TBase | Empty> {
    Where: () => IQueryable<TBase, TStrParams, TNumParams, TDateParams>,
    Add: (rec: TBase) => void,
    Remove: (rec: TBase) => void,
    Update: (rec: TBase) => void,
    Changes: Uncommitted<TBase>[],
}


export interface Empty { }