import { Injectable } from '@nestjs/common';
import {
  ClassConstructor,
  instanceToPlain,
  plainToClass,
} from 'class-transformer';

@Injectable()
export class EntityDtoMapper<E, CreateE, UpdateE, ResponseE> {
  createEDto: ClassConstructor<CreateE> | null = null;
  updateEDto: ClassConstructor<UpdateE> | null = null;
  responseEDto: ClassConstructor<ResponseE> | null = null;

  setDtoObjects(
    createEDto: ClassConstructor<CreateE> | null,
    updateEDto: ClassConstructor<UpdateE> | null,
    responseEDto: ClassConstructor<ResponseE> | null
  ) {
    this.createEDto = createEDto;
    this.updateEDto = updateEDto;
    this.responseEDto = responseEDto;
  }

  mapEToCreateE(entity: E | null): CreateE {
    return this.mapEToDtoE(entity, this.createEDto) as CreateE;
  }

  mapEToUpdateE(entity: E | null): UpdateE {
    return this.mapEToDtoE(entity, this.updateEDto) as UpdateE;
  }

  mapEToResponseE(entity: E | null): ResponseE {
    return this.mapEToDtoE(entity, this.responseEDto) as ResponseE;
  }

  mapEToDtoE(
    entity: E | null,
    dtoInstance: ClassConstructor<CreateE | UpdateE | ResponseE> | null
  ) {
    if (!dtoInstance || !entity) {
      return entity;
    }
    return plainToClass(dtoInstance, instanceToPlain(entity), {
      excludeExtraneousValues: true,
    });
  }
}
