export interface IQueryable<TBase,
 TStrParams extends keyof TBase, 
 TNumParams extends keyof TBase,
 TDateParams extends keyof TBase
 > {
    GetAll: () => Promise<TBase[]>
    GetFirst: () => Promise<TBase>
    Contains: (prop: TStrParams, val: string) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    BiggerThen: (prop: TNumParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
    Year: (prop: TDateParams, val: number) => IQueryable<TBase, TStrParams, TNumParams,TDateParams>
};

export type AllowedOperationValueTypes = number | string | Date

export type AllowedFieldTypes = 'number' | 'string' | 'Date' 

export type Condition = {
    FieldName: string
    FieldType: AllowedFieldTypes
    Operator: string
    OperationValue: AllowedOperationValueTypes
}
