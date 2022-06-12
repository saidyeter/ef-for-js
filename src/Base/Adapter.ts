import sql from 'mssql'

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
    constructor(protected arg: DbAdapterConstructorArgument) { }

    abstract execute(v: Sql): Promise<void> ;
    abstract read<TResult>(v: Sql): Promise<TResult[]>;
}


export class MsSqlAdapter extends DbAdapter {

    private pool : sql.ConnectionPool = {} as sql.ConnectionPool
    private async connect(): Promise<sql.ConnectionPool> {
        if (this.pool.available && this.pool.connected) {
            return this.pool
        }
        
        if (typeof this.arg === 'string') {
            return await sql.connect(this.arg)
        } else if (typeof this.arg === 'object') {
            return await sql.connect({
                server: this.arg.server,
                database: this.arg.database,
                user: this.arg.user,
                password: this.arg.password,
                options : {
                    trustServerCertificate : true
                }
            })
        }
        throw new Error(`invalid connection: ${this.arg}`)
    }

    private convert(sqlType: SqlDataType) : sql.ISqlTypeFactoryWithNoParams{
        switch (sqlType) {
            case 'int' : return sql.Int
            case 'smallint' : return sql.SmallInt
            case 'bigint': return sql.BigInt;

            case 'date' : return sql.Date
            case 'time' : return sql.Time
            case 'datetime' : return sql.DateTime

            case 'char' : return sql.Char;
            case 'varchar' : return sql.VarChar
            case 'nvarchar' : return sql.NVarChar

            default : break;
        }

        throw new Error(`invalid data type: ${sqlType}`)
    }

    async execute(v: Sql): Promise<void> {
        const pool = await this.connect()
    
        const request = pool.request()

        v.Parameters?.forEach(p=>{
            request.input(p.Name, this.convert(p.DataType), p.Value)
        })

        const result = await request.query(v.Statement)
        console.log(result);
        
    }

    async read<TResult>(v: Sql): Promise<TResult[]> {

        const pool = await this.connect()
        const request = pool.request()

        v.Parameters?.forEach(p=>{
            request.input(p.Name, this.convert(p.DataType), p.Value)
        })

        const result = await request.query<TResult>(v.Statement)

        // console.log(result.output);
        // console.log(result.recordset);
        // console.log(result.recordsets);
        // console.log(result.rowsAffected);
        
        return result.recordset
    }

}