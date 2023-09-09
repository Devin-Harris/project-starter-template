import { Inject } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import {
  And,
  DeepPartial,
  Equal,
  FindOneOptions,
  FindOperator,
  FindOptionsWhere,
} from 'typeorm';
import {
  EntityBusinessLogic,
  FindOptionsWithWhereArray,
} from './entity-business-logic-base.bl';
import { EntityDtoMapper } from './entity-dto-mapper';
import { EntityRepository } from './entity-repository-base';

export class EntityProvider<
  E,
  CreateE extends DeepPartial<E> = E,
  UpdateE extends DeepPartial<E> = E,
  ResponseE extends DeepPartial<E> = E
> {
  @Inject(EntityDtoMapper)
  private entityDtoMapper: EntityDtoMapper<E, CreateE, UpdateE, ResponseE>;

  private primaryKey: keyof E | null = null;

  constructor(
    public repository: EntityRepository<E>,
    public bl: EntityBusinessLogic<E, CreateE, UpdateE, ResponseE>
  ) {
    this.primaryKey = this.repository.getEntityPrimaryKeyColumn();
  }

  setDtoObjects(
    createEDto: ClassConstructor<CreateE> | null,
    updateEDto: ClassConstructor<UpdateE> | null,
    responseEDto: ClassConstructor<ResponseE> | null
  ) {
    this.entityDtoMapper.setDtoObjects(createEDto, updateEDto, responseEDto);
  }

  async getMany(options: FindOneOptions<E> = {}) {
    this.bl.preGet(options as FindOptionsWithWhereArray<E>);
    const result = await this.repository.find(options);
    this.bl.postGet(result, options as FindOptionsWithWhereArray<E>);
    return result.map((r) => this.entityDtoMapper.mapEToResponseE(r));
  }

  async getOne(id: number, options: FindOneOptions<E> = {}) {
    this.bl.preGet(options as FindOptionsWithWhereArray<E>, id);
    this.buildSingleGetWhere(id, options);
    const result = await this.repository.findOne(options);
    this.bl.postGet(result, options as FindOptionsWithWhereArray<E>);
    return this.entityDtoMapper.mapEToResponseE(result);
  }

  async saveMany(entities: (CreateE | UpdateE)[]) {
    this.bl.preSave(entities);
    const result = await this.repository.save(entities);
    this.bl.postSave(entities);
    return result.map((r) => this.entityDtoMapper.mapEToResponseE(r));
  }

  async saveOne(entity: CreateE | UpdateE) {
    this.bl.preSave([entity]);
    const result = await this.repository.save(entity);
    this.bl.postSave([entity]);
    return this.entityDtoMapper.mapEToResponseE(result);
  }

  async deleteMany(entities: E[]) {
    const entityIds: number[] = entities.map(
      (e) => e[this.primaryKey]
    ) as number[];
    this.bl.preDelete(entityIds);
    const result = await this.repository.delete(entityIds);
    this.bl.postDelete(entityIds);
    return result;
  }

  async deleteOne(entity: E) {
    const entityId: number = entity[this.primaryKey] as number;
    this.bl.preDelete([entityId]);
    const result = await this.repository.delete(entityId);
    this.bl.postDelete([entityId]);
    return result;
  }

  private buildWhereArray(where?: FindOptionsWhere<E> | FindOptionsWhere<E>[]) {
    return where ? (Array.isArray(where) ? where : [where]) : [];
  }

  private buildSingleGetWhere(id: number, options: FindOneOptions<E>) {
    const where = this.buildWhereArray(options.where).map((w) => ({
      ...w,
      [this.primaryKey]: Object.keys(w).some(
        (k) => k === this.primaryKey && w[k] !== id
      )
        ? And(w[this.primaryKey] as FindOperator<any>, Equal(id))
        : id,
    }));

    options.where =
      where.length === 0
        ? [{ [this.primaryKey]: id } as FindOptionsWhere<E>]
        : where;
  }
}
