export const _rootTableNameKey = 'rootTableName';

export function RootTableName<T extends EnumObject>(rootTableName: string) {
  return function <S extends EnumConstructor<T>>(constructor: S) {
    const cls = class extends constructor {};
    cls[_rootTableNameKey] = rootTableName;
    return cls;
  };
}

export class EnumClass<T> {
  rootTableName: string | undefined;
  reversedObject: { [x: number]: { value: string; displayName?: string } } = {};
}

export type EnumObject = {
  [x: string]: number | { id: number; displayName?: string };
};

export function Enum<T extends EnumObject>(value: T): EnumConstructor<T> & T {
  const c = class extends EnumClass<T> {};
  c['reversedObject'] = {};
  const enumIds: Set<number> = new Set<number>();
  for (let key of Object.keys(value)) {
    const enumField = value[key];
    const id = typeof enumField === 'number' ? enumField : enumField.id;
    const displayName =
      typeof enumField === 'number' ? undefined : enumField.displayName;
    c[key] = id;
    c['reversedObject'][id] = {
      value: key,
      displayName: displayName ?? key,
    };
    if (enumIds.has(id)) {
      throw new Error('Cannot create an enum with duplicate values');
    } else {
      enumIds.add(id);
    }
  }
  return c as EnumConstructor<T> & T;
}

export type EnumConstructor<T> = new (...args: any[]) => EnumClass<T>;
