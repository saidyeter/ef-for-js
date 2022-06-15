import { DbAdapter, Sql, SqlParameter } from "./Adapter"
import { ChangeKindEnum } from "./ChangeKindEnum"
import { DbSet } from "./DbSet"
import { DbTable } from "./DbTable"
import { AllowedFieldTypes, AllowedOperationValueTypes, Condition, IQueryable } from "./IQueryable"
import { Uncommitted } from "./Uncommitted"

export function BaseDbSet<TBase,
    TStrParams extends keyof TBase, 
    TNumParams extends keyof TBase,
    TDateParams extends keyof TBase>
    (tableName: string, adapter: DbAdapter, table: DbTable): DbSet<TBase, TStrParams, TNumParams,TDateParams> {
    const changes: Uncommitted<TBase>[] = []

    function createChange(rec: TBase, changeType: ChangeKindEnum): Uncommitted<TBase> {
        return {
            ChangeKind: changeType,
            Data: rec,
        }
    }
    function add(rec: TBase) { changes.push(createChange(rec, ChangeKindEnum.Add)) }
    function remove(rec: TBase) { changes.push(createChange(rec, ChangeKindEnum.Remove)) }
    function update(rec: TBase) { changes.push(createChange(rec, ChangeKindEnum.Update)) }

    function generateWhere(): IQueryable<TBase, TStrParams, TNumParams,TDateParams> {
        const conditions: Condition[] = []

        const iqueryable: IQueryable<TBase, TStrParams, TNumParams,TDateParams> = {
            GetAll: readAll,
            GetFirst: readFirst,

            Contains: contains,
            BiggerThen: biggerThen,

            Year:year
        }

        function getConditionString(): [string, SqlParameter[]] {
            const columnParamKey= 'p'
            const sqlParameters: SqlParameter[] = []
            const conditionStrings = conditions.map((element, index) => {
                const columnSqlType = table.Columns.filter(x => x.Name == element.FieldName)[0].Type
                const columnParamName = '@'+ columnParamKey + index.toString()

                sqlParameters.push({
                    DataType: columnSqlType,
                    Name: columnParamKey + index.toString(),
                    Value: element.OperationValue as AllowedOperationValueTypes
                })

                switch (element.FieldType) {
                    case 'Date':
                        switch (element.Operator) {
                            case 'biggerThan': return adapter.createDateBiggerThanWhereString(element.FieldName, columnParamName)
                            case 'lessThan': return adapter.createDateLessThanWhereString(element.FieldName, columnParamName)
                            case 'year': return adapter.createDateYearWhereString(element.FieldName, columnParamName)
                            case 'month': return adapter.createDateMonthWhereString(element.FieldName, columnParamName)
                            case 'day': return adapter.createDateDayWhereString(element.FieldName, columnParamName)
                            default: return ''
                        }
                    case 'number':
                        switch (element.Operator) {
                            case 'biggerThan': return adapter.createNumberBiggerThanWhereString(element.FieldName,columnParamName)
                            case 'lessThan': return adapter.createNumberLessThanWhereString(element.FieldName,columnParamName)
                            case 'equals': return adapter.createNumberEqualsWhereString(element.FieldName,columnParamName)
                            default: return ''
                        }
                    case 'string':
                        switch (element.Operator) {
                            case 'contains': return adapter.createStringContainsWhereString(element.FieldName,columnParamName)
                            case 'startsWith': return adapter.createStringStartsWithWhereString(element.FieldName,columnParamName)
                            case 'endsWith': return adapter.createStringEndsWithWhereString(element.FieldName,columnParamName)
                            default: return ''
                        }
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
            console.log(sql,conditionParams);
            
            const result = await adapter.read<TBase>({
                Statement: sql,
                Parameters: conditionParams
            })
            console.log(result);
            
            return result[0]
        }

        function addToContition(
            prop: unknown,
            fieldType: AllowedFieldTypes,
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

        function contains(prop: TStrParams, val: string) {
            addToContition(prop, 'string', 'contains', val)
            return iqueryable
        }

        function biggerThen(prop: TNumParams, val: number) {
            addToContition(prop, 'number', 'biggerThan', val)
            return iqueryable
        }

        function year(prop: TDateParams, val: number) {
            addToContition(prop, 'number', 'year', val)
            return iqueryable
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
    tableName: string,
    table: DbTable,
    adapter: DbAdapter) {

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
        const columnParamKey= 'p'
        const keyColumnParamKey= 'k'
        let statement: string = ''
        let params: SqlParameter[] = []
        switch (change.ChangeKind) {
            case ChangeKindEnum.Add: 
                statement = adapter.getInsertString(tableName,table,columnParamKey)
                params = table.Columns.map((x, i): SqlParameter => {
                    return {
                        DataType: x.Type,
                        Name: columnParamKey + i.toString(),
                        Value: getChangeVal(change, x.Name)
                    }
                })
                break;
            case ChangeKindEnum.Update:
                statement = adapter.getUpdateString(tableName,table,columnParamKey,keyColumnParamKey)
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
                statement = adapter.getDeleteString(tableName,table,keyColumnParamKey)
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
