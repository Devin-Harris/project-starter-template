import { Enum, EnumValue } from './utilities/enum-utilities';

@Enum('HousingTypes')
export class HousingTypes {
    static House: EnumValue = 0
    static Dorm: EnumValue = 1
    static Apartment: EnumValue = { id: 3, displayName: 'Apartment Complex' }
}
