import { DeepPartial, FindOneOptions, FindOptionsWhere } from 'typeorm';

export type FindOptionsWithWhereArray<E> = FindOneOptions<E> & {
  where: FindOptionsWhere<E>[];
};

export class EntityBusinessLogic<
  E,
  CreateE extends DeepPartial<E> = E,
  UpdateE extends DeepPartial<E> = E,
  ResponseE extends DeepPartial<E> = E
> {
  constructor() {}

  preGet(options: FindOptionsWithWhereArray<E>, id?: number) {}

  postGet(result: E | E[], options: FindOptionsWithWhereArray<E>) {}

  preSave(entities: (CreateE | UpdateE)[]) {}

  postSave(entities: (CreateE | UpdateE)[]) {}

  preDelete(ids: number[]) {}

  postDelete(ids: number[]) {}
}
