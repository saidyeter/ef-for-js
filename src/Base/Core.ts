import { DbAdapter, Sql, SqlParameter } from "./Adapter"
import { ChangeKindEnum } from "./ChangeKindEnum"
import { DbSet } from "./DbSet"
import { DbTable } from "./DbTable"
import { AllowedFieldTypes, AllowedOperationValueTypes, Condition, IQueryable } from "./IQueryable"
import { Uncommitted } from "./Uncommitted"

export function BaseDbSet<TBase, TStrParams extends keyof TBase, TNumParams extends keyof TBase>(tableName: string):
    DbSet<TBase, TStrParams, TNumParams> {

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

    function generateWhere(): IQueryable<TBase, TStrParams, TNumParams> {
        const conditions: Condition[] = []

        const iqueryable: IQueryable<TBase, TStrParams, TNumParams> = {
            GetAll: readAll,
            GetFirst: readFirst,

            Contains: contains,
            BiggerThen: biggerThen
        }

        function getConditionString(): string {
            const conditionStrings = conditions.map(element => {
                switch (element.FieldType) {
                    case 'Date': return ''
                    case 'boolean': return ''
                    case 'number':
                        switch (element.Operator) {
                            case 'biggerThan': return `${element.FieldName} > ${element.OperationValue}`
                            case 'lessThan': return `${element.FieldName} < ${element.OperationValue}`
                            case 'equals': return `${element.FieldName} = ${element.OperationValue}`
                            default: return ''
                        }
                    case 'string':
                        switch (element.Operator) {
                            case 'contains': return `${element.FieldName} LIKE '%${element.OperationValue}%'`
                            case 'startsWith': return `${element.FieldName} LIKE '${element.OperationValue}%'`
                            case 'endsWith': return `${element.FieldName} LIKE '%${element.OperationValue}'`
                            default: return ''
                        }
                    default: return ''
                }
            });

            const clearConditionStrings = conditionStrings.filter(v => v.length > 0)

            const conditionPart: string = clearConditionStrings.length == 0 ? '' : 'WHERE ' + clearConditionStrings.join(' and ')
            return conditionPart
        }

        function readAll(): TBase[] {
            const conditionPart = getConditionString()
            const sql: string = `SELECT * FROM ${tableName} ${conditionPart}`
            console.log(sql);
            return []
        }
        function readFirst(): TBase {
            const conditionPart = getConditionString()
            const sql: string = `SELECT TOP 1 * FROM ${tableName} ${conditionPart}`
            console.log(sql);
            return ({} as TBase)
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



export function TableSaveChanges<TBase>(
    tableChanges: Uncommitted<TBase>[],
    tableName: string,
    table: DbTable,
    adapter: DbAdapter) {

    const sqlList: Sql[] = []
    function getChangeVal(c: Uncommitted<TBase>, columnName: string): string {
        const columnKey = columnName as keyof TBase
        const val = c.Data[columnKey]
        return String(val)
    }

    tableChanges.forEach(change => {
        switch (change.ChangeKind) {
            case ChangeKindEnum.Add:
                const columnNames = table.Columns.map(x => x.Name).join(' ,')
                const columnParams = table.Columns.map((_, i) => '@p' + i.toString()).join(' ,')
                const statement = `INSERT INTO ${tableName} (${columnNames}) VALUES (${columnParams})`
                const params = table.Columns.map((x,i):SqlParameter =>{
                    return {
                        DataType : x.Type,
                        Name: '@p' + i.toString(),
                        Value : getChangeVal(change, x.Name)
                    }
                })
                
                //table.Columns.map((x, i) => '@p' + i.toString() + `= '${getChangeVal(change, x.Name)}'`).join(' ,')
                sqlList.push({
                    Statement: statement,
                    Parameters: params
                })
                break;
            default:
                break;
        }
    });

    sqlList.forEach(sql => {
        adapter.execute(sql)
    });
    
}
