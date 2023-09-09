import { Body, Delete, Get, Param, Post } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { DeepPartial } from 'typeorm';
import { FindOptionsWithWhereArray } from './entity-business-logic-base.bl';
import { EntityProvider } from './entity-provider-base.provider';

export class EntityController<
  E,
  CreateE extends DeepPartial<E> = DeepPartial<E>,
  UpdateE extends DeepPartial<E> = DeepPartial<E>,
  ResponseE extends DeepPartial<E> = DeepPartial<E>
> {
  constructor(
    public provider: EntityProvider<E, CreateE, UpdateE, ResponseE>,
    dtos?: {
      createEDto?: ClassConstructor<CreateE>;
      updateEDto?: ClassConstructor<UpdateE>;
      responseEDto?: ClassConstructor<ResponseE>;
    }
  ) {
    this.provider.setDtoObjects(
      dtos?.createEDto ?? null,
      dtos?.updateEDto ?? null,
      dtos?.responseEDto ?? null
    );
  }

  @Get()
  getMany(@Body() options?: FindOptionsWithWhereArray<E>) {
    return this.provider.getMany(options);
  }

  @Get(':id')
  getOne(
    @Param() params: { id: number },
    @Body() options?: FindOptionsWithWhereArray<E>
  ) {
    return this.provider.getOne(params.id, options);
  }

  @Post()
  saveMany(@Body() entities: (CreateE | UpdateE)[]) {
    return this.provider.saveMany(entities);
  }

  @Post(':id')
  saveOne(@Param() params: { id: number }, @Body() entity: CreateE | UpdateE) {
    return this.provider.saveOne(entity);
  }

  @Delete()
  deleteMany(@Body() entities: E[]) {
    return this.provider.deleteMany(entities);
  }

  @Delete(':id')
  deleteOne(@Param() params: { id: number }, @Body() entity: E) {
    return this.provider.deleteOne(entity);
  }
}
