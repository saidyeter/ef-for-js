export interface IQueryable<TBase, TStrParams extends keyof TBase, TNumParams extends keyof TBase> {
    GetAll: () => TBase[]
    GetFirst: () => TBase
    Contains: (prop: TStrParams, val: string) => IQueryable<TBase, TStrParams, TNumParams>
    BiggerThen: (prop: TNumParams, val: number) => IQueryable<TBase, TStrParams, TNumParams>
};

export type AllowedOperationValueTypes = number | string | Date | boolean

export type AllowedFieldTypes = 'number' | 'string' | 'Date' | 'boolean'

export type Condition = {
    FieldName: string
    FieldType: AllowedFieldTypes
    Operator: string
    OperationValue: AllowedOperationValueTypes
}
