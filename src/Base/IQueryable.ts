import { SqlDataType } from "./Adapter"

export interface IQueryable<TBase,
 TStrParams extends keyof TBase, 
 TNumParams extends keyof TBase,
 TDateParams extends keyof TBase
 > {
    GetAll: () => Promise<TBase[]>
    GetFirst: () => Promise<TBase>
    
    Contains: (prop: TStrParams, val: string) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    StartsWith: (prop: TStrParams, val: string) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    EndsWith: (prop: TStrParams, val: string) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    EqualsText: (prop: TStrParams, val: string) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    Length: (prop: TStrParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    
    BiggerThenNumber: (prop: TNumParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    LessThenNumber: (prop: TNumParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    EqualsNumber: (prop: TNumParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    // InNumbers: (prop: TNumParams, val: number[]) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    
    Year: (prop: TDateParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    Month: (prop: TDateParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    Day: (prop: TDateParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    Hour: (prop: TDateParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    Minute: (prop: TDateParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    Second: (prop: TDateParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    BiggerThenDate: (prop: TDateParams, val: Date) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    LessThenDate: (prop: TDateParams, val: Date) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
   
};

export type AllowedOperationValueTypes = number | string | Date


export interface Condition  {
    FieldName: string
    FieldType: SqlDataType
    Operator: string
    OperationValue: AllowedOperationValueTypes
}
