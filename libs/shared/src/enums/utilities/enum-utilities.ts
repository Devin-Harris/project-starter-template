export const _rootTableNameKey = 'rootTableName';
export const _reversedObjectKey = 'reversedObject'

export function Enum(rootTableName: string) {
  return function <S extends new (...args: any[]) => {}>(constructor: S) {
    const cls = class extends constructor {};
    cls[_rootTableNameKey] = rootTableName;
    cls[_reversedObjectKey] = {}
    const enumIds: Set<number> = new Set<number>();

    for (let key of Object.keys(constructor).filter(k => k !== _reversedObjectKey)) {
      const enumField = constructor[key];
      const id = typeof enumField === 'number' ? +enumField : +enumField.id;
      const displayName = typeof enumField === 'number' ? undefined : enumField.displayName;
      cls[key] = id;
      cls[_reversedObjectKey][id] = {
        value: key.toString(),
        displayName: displayName ?? key,
      };
      if (enumIds.has(id)) {
        throw new Error('Cannot create an enum with duplicate values');
      } else {
        enumIds.add(id);
      }
    }

    return cls;
  };
}

export class EnumClass {
  rootTableName: string | undefined;
  reversedObject: { [x: number]: { value: string; displayName?: string } } = {};
}

export type EnumObject = {
  [x: string]: number | { id: number; displayName?: string };
};
