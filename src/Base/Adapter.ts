import { AllowedOperationValueTypes } from "./IQueryable"

export type DbConfig = {
    user: string,
    password: string,
    server: string,
    database: string,
}



export type SqlDataType = 'smallint' | 'int' | 'bigint' | 'char' | 'varchar' | 'nvarchar' | 'date' | 'time' | 'datetime'
export type SqlParameter = {
    Name: string,
    Value: AllowedOperationValueTypes,
    DataType: SqlDataType
}

export type Sql = {
    Statement: string, 
    Parameters?: SqlParameter[]
}

export type DbAdapterConstructorArgument = DbConfig | string

export abstract class DbAdapter {
    constructor(protected arg:DbAdapterConstructorArgument) { }

    abstract execute(v:Sql): void;
    abstract read<TResult>(v:Sql): TResult[];
}


export class MsSqlAdapter extends DbAdapter {


    execute(v:Sql): void {
        console.log(v);
    }
    read<TResult>(v:Sql): TResult[] {
        console.log(v);
        return [] as TResult[]
    }

}