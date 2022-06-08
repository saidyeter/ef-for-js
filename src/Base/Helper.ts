import { ChangeKindEnum } from "./ChangeKindEnum"
import { DbSet } from "./DbSet"
import { Condition, IQueryable } from "./IQueryable"
import { Uncommitted } from "./Uncommitted"

export function BaseDbSet<TBase, TStrParams, TNumParams>(): DbSet<TBase, TStrParams, TNumParams> {

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

    function generateToArray(): TBase[] { return [] }

    function generateWhere(): IQueryable<TBase, TStrParams, TNumParams> {


        const conditions: Condition[] = []

        const iqueryable: IQueryable<TBase, TStrParams, TNumParams> = {
            ToArray: generateToArray,
            Conditions: conditions,
            Contains: contains,
            BiggerThen: biggerThen
        }

        function addToContition(prop: unknown, fieldType: 'number' | 'string' | 'Date' | 'boolean', operator: string, val: number | string | Date | boolean) {

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
            addToContition(prop, 'string', 'in', val)
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



