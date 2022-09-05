import { DbAdapter, Sql, SqlDataType, SqlParameter } from "./Adapter"
import { ChangeKindEnum } from "./ChangeKindEnum"
import { DbSet, Empty } from "./DbSet"
import { DbTable } from "./DbTable"
import { AllowedOperationValueTypes, Condition, IQueryable } from "./IQueryable"
import { Uncommitted } from "./Uncommitted"

export function BaseDbSet<TBase, TStrParams extends keyof TBase | Empty, TNumParams extends keyof TBase | Empty, TDateParams extends keyof TBase | Empty>
    (adapter: DbAdapter, table: DbTable): DbSet<TBase, TStrParams, TNumParams, TDateParams> {
    const changes: Uncommitted<TBase>[] = []
    const tableName: string = table.TableName

    function createChange(rec: TBase, changeType: ChangeKindEnum): Uncommitted<TBase> {
        return {
            ChangeKind: changeType,
            Data: rec,
        }
    }
    function add(rec: TBase) { changes.push(createChange(rec, ChangeKindEnum.Add)) }
    function remove(rec: TBase) { changes.push(createChange(rec, ChangeKindEnum.Remove)) }
    function update(rec: TBase) { changes.push(createChange(rec, ChangeKindEnum.Update)) }

    function generateWhere(): IQueryable<TBase, TStrParams, TNumParams, TDateParams> {
        const conditions: Condition[] = []

        const iqueryable: IQueryable<TBase, TStrParams, TNumParams, TDateParams> = {
            GetAll: readAll,
            GetFirst: readFirst,

            Contains: (prop: TStrParams, val: string) => {
                addToContition(prop, 'nvarchar', 'contains', val)
                return iqueryable
            },
            StartsWith: (prop: TStrParams, val: string) => {
                addToContition(prop, 'nvarchar', 'startsWith', val)
                return iqueryable
            },
            EndsWith: (prop: TStrParams, val: string) => {
                addToContition(prop, 'nvarchar', 'endsWith', val)
                return iqueryable
            },
            EqualsText: (prop: TStrParams, val: string) => {
                addToContition(prop, 'nvarchar', 'equalsText', val)
                return iqueryable
            },
            Length: (prop: TStrParams, val: number) => {
                addToContition(prop, 'int', 'length', val)
                return iqueryable
            },

            BiggerThenNumber: (prop: TNumParams, val: number) => {
                addToContition(prop, 'int', 'biggerThenNumber', val)
                return iqueryable
            },
            LessThenNumber: (prop: TNumParams, val: number) => {
                addToContition(prop, 'int', 'lessThenNumber', val)
                return iqueryable
            },
            EqualsNumber: (prop: TNumParams, val: number) => {
                addToContition(prop, 'int', 'equalsNumber', val)
                return iqueryable
            },
            // InNumbers: (prop: TNumParams, val: number[]) =>{
            //     addToContition(prop, 'int','inNumbers', val)
            //     return iqueryable
            // },
            Year: (prop: TDateParams, val: number) => {
                addToContition(prop, 'int', 'year', val)
                return iqueryable
            },
            Month: (prop: TDateParams, val: number) => {
                addToContition(prop, 'int', 'month', val)
                return iqueryable
            },
            Day: (prop: TDateParams, val: number) => {
                addToContition(prop, 'int', 'day', val)
                return iqueryable
            },
            Hour: (prop: TDateParams, val: number) => {
                addToContition(prop, 'int', 'hour', val)
                return iqueryable
            },
            Minute: (prop: TDateParams, val: number) => {
                addToContition(prop, 'int', 'minute', val)
                return iqueryable
            },
            Second: (prop: TDateParams, val: number) => {
                addToContition(prop, 'int', 'second', val)
                return iqueryable
            },
            BiggerThenDate: (prop: TDateParams, val: Date) => {
                addToContition(prop, 'datetime', 'biggerThenDate', val)
                return iqueryable
            },
            LessThenDate: (prop: TDateParams, val: Date) => {
                addToContition(prop, 'datetime', 'lessThenDate', val)
                return iqueryable
            },
        }

        function getConditionString(): [string, SqlParameter[]] {
            const columnParamKey = 'p'
            const sqlParameters: SqlParameter[] = []
            const conditionStrings = conditions.map((element, index) => {
                const allColumns = [...table.Columns, table.KeyColumn]
                const columnSqlType = allColumns.filter(x => x.Name == element.FieldName)[0].Type
                const columnParamName = '@' + columnParamKey + index.toString()

                sqlParameters.push({
                    DataType: element.FieldType,
                    Name: columnParamKey + index.toString(),
                    Value: element.OperationValue as AllowedOperationValueTypes
                })

                switch (element.Operator) {
                    case 'biggerThenDate': return adapter.createDateBiggerThanWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'lessThenDate': return adapter.createDateLessThanWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'year': return adapter.createDateYearWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'month': return adapter.createDateMonthWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'day': return adapter.createDateDayWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'hour': return adapter.createDateHourWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'minute': return adapter.createDateMinuteWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'second': return adapter.createDateSecondWhereString(element.FieldName, columnParamName, columnSqlType)

                    case 'biggerThenNumber': return adapter.createNumberBiggerThanWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'lessThenNumber': return adapter.createNumberLessThanWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'equalsNumber': return adapter.createNumberEqualsWhereString(element.FieldName, columnParamName, columnSqlType)

                    case 'contains': return adapter.createStringContainsWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'startsWith': return adapter.createStringStartsWithWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'endsWith': return adapter.createStringEndsWithWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'equalsText': return adapter.createStringEqualsTextWhereString(element.FieldName, columnParamName, columnSqlType)
                    case 'length': return adapter.createStringLengthWhereString(element.FieldName, columnParamName, columnSqlType)
                    default: return ''
                }

            });

            const conditionPart: string = adapter.getConditionString(conditionStrings)
            return [conditionPart, sqlParameters]
        }

        async function readAll(): Promise<TBase[]> {
            const [conditionStr, conditionParams] = getConditionString()
            const sql: string = adapter.createSelectAllString(tableName, conditionStr)

            const result = await adapter.read<TBase>({
                Statement: sql,
                Parameters: conditionParams
            })
            return result

        }

        async function readFirst(): Promise<TBase> {
            const [conditionStr, conditionParams] = getConditionString()
            const sql: string = adapter.createSelectTopNString(tableName, conditionStr, 1)
            // console.log(sql, conditionParams);

            const result = await adapter.read<TBase>({
                Statement: sql,
                Parameters: conditionParams
            })
            // console.log(result);

            return result[0]
        }

        function addToContition(
            prop: unknown,
            fieldType: SqlDataType,
            operator: string,
            val: AllowedOperationValueTypes) {

            if (typeof prop !== 'string') {
                throw new Error(`Unknown prop type: ${prop}`);
            }

            const condition: Condition = {
                FieldName: prop,
                FieldType: fieldType,
                OperationValue: val,
                Operator: operator
            }

            conditions.push(condition)
        }

        return iqueryable
    }

    return {
        Changes: changes,
        Where: generateWhere,
        Add: add,
        Remove: remove,
        Update: update
    }
}



export async function TableSaveChanges<TBase>(
    tableChanges: Uncommitted<TBase>[],
    table: DbTable,
    adapter: DbAdapter) {
    const tableName: string = table.TableName
    const sqlList: Sql[] = []

    function getChangeVal(c: Uncommitted<TBase>, columnName: string): AllowedOperationValueTypes {
        const columnKey = columnName as keyof TBase
        const val = c.Data[columnKey]

        if (val instanceof Date) {
            return val
        } else if (typeof val === 'number') {
            return val
        } else {
            return String(val)
        }
    }

    tableChanges.forEach(change => {
        const columnParamKey = 'p'
        const keyColumnParamKey = 'k'
        let statement: string = ''
        let params: SqlParameter[] = []
        switch (change.ChangeKind) {
            case ChangeKindEnum.Add:
                statement = adapter.getInsertString(tableName, table, columnParamKey)
                params = table.Columns.map((x, i): SqlParameter => {
                    return {
                        DataType: x.Type,
                        Name: columnParamKey + i.toString(),
                        Value: getChangeVal(change, x.Name)
                    }
                })
                break;
            case ChangeKindEnum.Update:
                statement = adapter.getUpdateString(tableName, table, columnParamKey, keyColumnParamKey)
                params = table.Columns.map((x, i): SqlParameter => {
                    return {
                        DataType: x.Type,
                        Name: columnParamKey + i.toString(),
                        Value: getChangeVal(change, x.Name)
                    }
                })
                params.push({
                    DataType: table.KeyColumn.Type,
                    Name: keyColumnParamKey,
                    Value: getChangeVal(change, table.KeyColumn.Name)
                })
                break;
            case ChangeKindEnum.Remove:
                statement = adapter.getDeleteString(tableName, table, keyColumnParamKey)
                params.push({
                    DataType: table.KeyColumn.Type,
                    Name: keyColumnParamKey,
                    Value: getChangeVal(change, table.KeyColumn.Name)
                })
                break;
            default:
                break;
        }
        sqlList.push({
            Statement: statement,
            Parameters: params
        })
    });

    sqlList.forEach(async sql => {
        await adapter.execute(sql)
    });

}
