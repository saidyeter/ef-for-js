export interface IQueryable<TBase,TStrParams,TNumParams> {
    Conditions : Condition[]
    ToArray: () => TBase[]
    Contains : (prop: TStrParams, val: string) => IQueryable<TBase,TStrParams,TNumParams>
    BiggerThen : (prop: TNumParams, val: number)=> IQueryable<TBase,TStrParams,TNumParams>
}; 

export type Condition={
    FieldName: string
    FieldType: 'number' | 'string' | 'Date' | 'boolean'
    Operator : string
    OperationValue: number | string | Date | boolean
}
