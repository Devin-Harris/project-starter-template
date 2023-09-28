import { Enum, RootTableName } from './utilities/enum-utilities';

@RootTableName('HousingTypes')
export class HousingTypes extends Enum({
  House: 0,
  Dorm: 1,
  Apartment: 2,
}) {}
