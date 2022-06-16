import sql from 'mssql'
import { DbTable } from './DbTable'

import { AllowedOperationValueTypes } from "./IQueryable"

export type SqlDataType = 'smallint' | 'int' | 'bigint' | 'char' | 'varchar' | 'nvarchar' | 'date' | 'time' | 'datetime'
export interface SqlParameter  {
    Name: string,
    Value: AllowedOperationValueTypes,
    DataType: SqlDataType
}

export interface Sql {
    Statement: string,
    Parameters?: SqlParameter[]
}

export type DbAdapterConstructorArgument = {} | string

export abstract class DbAdapter {
    constructor(protected arg: DbAdapterConstructorArgument) { }

    abstract execute(v: Sql): Promise<void>;
    abstract read<TResult>(v: Sql): Promise<TResult[]>;

    getConditionString(conditionExpressions: string[]): string {
        const clearConditionStrings = conditionExpressions.filter(v => v.length > 0)
        return clearConditionStrings.length == 0 ? '' : 'WHERE ' + clearConditionStrings.join(' and ')
    }

    getInsertString(tableName: string, table: DbTable,columnParamKey:string): string {
        const columnNames = table.Columns.map(x => x.Name).join(' ,')
        const columnParams = table.Columns.map((_, i) => '@' + columnParamKey + i.toString()).join(' ,')
        return `INSERT INTO ${tableName} (${columnNames}) VALUES (${columnParams})`
    }
    getUpdateString(tableName: string, table: DbTable, columnParamKey: string, keyColumnParamKey: string): string {
        return `UPDATE ${tableName} SET ${table.Columns.map((c, i) => c.Name + ' = @' + columnParamKey  + i.toString()).join(' ,')} WHERE ${table.KeyColumn.Name + ' = @' + keyColumnParamKey }`
    }
    getDeleteString(tableName: string, table: DbTable, keyColumnParamKey: string): string {
        return `DELETE FROM ${tableName} WHERE ${table.KeyColumn.Name + ' = @' + keyColumnParamKey }`
    }

    createSelectAllString(tableName: string, conditionStr: string): string {
        return `SELECT * FROM ${tableName} ${conditionStr}`
    }

    createSelectTopNString(tableName: string, conditionStr: string, n: number): string {
        return `SELECT TOP ${n} * FROM ${tableName} ${conditionStr}`
    }

    createNumberBiggerThanWhereString(fieldName: string, columnParamName: string): string {
        return `${fieldName} > ${columnParamName}`
    }
    createNumberLessThanWhereString(fieldName: string, columnParamName: string): string {
        return `${fieldName} < ${columnParamName}`
    }
    createNumberEqualsWhereString(fieldName: string, columnParamName: string): string {
        return `${fieldName} = ${columnParamName}`
    }


    createDateBiggerThanWhereString(fieldName: string, columnParamName: string): string {
        return `${fieldName} > ${columnParamName}`
    }
    createDateLessThanWhereString(fieldName: string, columnParamName: string): string {
        return `${fieldName} < ${columnParamName}`
    }
    createDateYearWhereString(fieldName: string, columnParamName: string): string {
        return `DATEPART(YEAR, ${fieldName}) = ${columnParamName}`
    }
    createDateMonthWhereString(fieldName: string, columnParamName: string): string {
        return `DATEPART(MONTH, ${fieldName}) = ${columnParamName}`
    }
    createDateDayWhereString(fieldName: string, columnParamName: string): string {
        return `DATEPART(DAY, ${fieldName}) = ${columnParamName}`
    }
    createDateHourWhereString(fieldName: string, columnParamName: string): string {
        return `DATEPART(HOUR, ${fieldName}) = ${columnParamName}`
    }
    createDateMinuteWhereString(fieldName: string, columnParamName: string): string {
        return `DATEPART(MINUTE, ${fieldName}) = ${columnParamName}`
    }
    createDateSecondWhereString(fieldName: string, columnParamName: string): string {
        return `DATEPART(SECOND, ${fieldName}) = ${columnParamName}`
    }



    createStringContainsWhereString(fieldName: string, columnParamName: string): string {
        return `${fieldName} LIKE '%' + ${columnParamName} + '%'`
    }
    createStringStartsWithWhereString(fieldName: string, columnParamName: string): string {
        return `${fieldName} LIKE ${columnParamName} + '%'`
    }
    createStringEndsWithWhereString(fieldName: string, columnParamName: string): string {
        return `${fieldName} LIKE '%' + ${columnParamName}`
    }
    createStringEqualsTextWhereString(fieldName: string, columnParamName: string): string {
        return `${fieldName} = ${columnParamName}`
    }
    createStringLengthWhereString(fieldName: string, columnParamName: string): string {
        return `LEN(${fieldName}) = ${columnParamName}`
    }

}


export class MsSqlAdapter extends DbAdapter {

    private pool: sql.ConnectionPool = {} as sql.ConnectionPool
    private async connect(): Promise<sql.ConnectionPool> {
        if (this.pool.available && this.pool.connected) {
            return this.pool
        }

        if (typeof this.arg === 'string') {
            return await sql.connect(this.arg)
        } else if (typeof this.arg === 'object') {
            return await sql.connect(this.arg as sql.config)
        }
        throw new Error(`invalid connection: ${this.arg}`)
    }

    private convert(sqlType: SqlDataType): sql.ISqlTypeFactoryWithNoParams {

        switch (sqlType) {
            case 'int': return sql.Int
            case 'smallint': return sql.SmallInt
            case 'bigint': return sql.BigInt;

            case 'date': return sql.Date
            case 'time': return sql.Time
            case 'datetime': return sql.DateTime

            case 'char': return sql.Char;
            case 'varchar': return sql.VarChar
            case 'nvarchar': return sql.NVarChar

            default: break;
        }

        throw new Error(`invalid data type: ${sqlType}`)
    }

    async execute(v: Sql): Promise<void> {
        const pool = await this.connect()

        const request = pool.request()

        v.Parameters?.forEach(p => {
            let datatype =this.convert(p.DataType)
            // if (datatype == sql.Date ||
            //     datatype == sql.Time ||
            //     datatype == sql.DateTime) {
                
            //         if (typeof p.Value == 'number') {
            //             datatype = sql.Int
            //         }
                    
            // }
            request.input(p.Name, datatype, p.Value)
        })

        const result = await request.query(v.Statement)
        console.log(result);

    }

    async read<TResult>(v: Sql): Promise<TResult[]> {

        const pool = await this.connect()
        const request = pool.request()

        v.Parameters?.forEach(p => {
            let datatype =this.convert(p.DataType)
            // if (datatype == sql.Date ||
            //     datatype == sql.Time ||
            //     datatype == sql.DateTime) {
                
            //         if (typeof p.Value == 'number') {
            //             datatype = sql.Int
            //         }
                    
            // }
            request.input(p.Name, datatype, p.Value)
        })

        const result = await request.query<TResult>(v.Statement)

        // console.log(result.output);
        // console.log(result.recordset);
        // console.log(result.recordsets);
        // console.log(result.rowsAffected);

        return result.recordset
    }

}