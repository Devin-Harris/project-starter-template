export type EnumTableResponseRow = { id: number; value: string };

export type EnumTableSyncType = 'update' | 'delete' | 'insert';

export interface EnumTableSyncItem {
  rootTableName: string;
  id: number;
  type: EnumTableSyncType;
}

export interface EnumTableSyncUpdateItem extends EnumTableSyncItem {
  newValue: string;
  currentValue: string | null;
  type: 'update';
}
export interface EnumTableSyncInsertItem extends EnumTableSyncItem {
  newValue: string;
  type: 'insert';
}
export interface EnumTableSyncDeleteItem extends EnumTableSyncItem {
  currentValue: string | null;
  type: 'delete';
}

export type EnumTableSyncItemType =
  | EnumTableSyncUpdateItem
  | EnumTableSyncInsertItem
  | EnumTableSyncDeleteItem;
