export const _rootTableNameKey = 'rootTableName';
export const _reversedObjectKey = 'reversedObject';

export function Enum(rootTableName: string) {
  return function <S extends new (...args: any[]) => {}>(constructor: S) {
    const cls = class extends constructor {};
    cls[_rootTableNameKey] = rootTableName;
    cls[_reversedObjectKey] = {};
    const enumIds: Set<number> = new Set<number>();

    for (let key of Object.keys(constructor)) {
      const enumField = constructor[key];
      const id = typeof enumField === 'number' ? +enumField : +enumField.id;
      const displayName =
        typeof enumField === 'number' ? undefined : enumField.displayName;
      cls[key] = id;
      cls[_reversedObjectKey][id] = {
        value: key,
        displayName: displayName ?? key,
      };
      if (enumIds.has(id)) {
        throw new Error('Cannot create an enum with duplicate ids');
      } else {
        enumIds.add(id);
      }
    }

    return cls;
  };
}

export class EnumClass {
  [_rootTableNameKey]: string | undefined;
  [_reversedObjectKey]: {
    [x: number]: Omit<EnumLookup, 'id'>;
  } = {};

  static get(enumField: EnumValue): EnumLookup {
    const id = typeof enumField === 'number' ? +enumField : +enumField.id;
    const match: Omit<EnumLookup, 'id'> | null =
      this && this[_reversedObjectKey] && this[_reversedObjectKey][id]
        ? this[_reversedObjectKey][id]
        : null;
    if (!match) {
      throw new Error(
        `Could not find match with id ${id} on ${this[_rootTableNameKey]}`
      );
    }

    return { ...this[_reversedObjectKey][id], id };
  }
}

export type EnumObject = {
  [x: string]: EnumValue;
};
export type EnumValue = number | { id: number; displayName: string };
export type EnumLookup = { value: string; displayName: string; id: number };
