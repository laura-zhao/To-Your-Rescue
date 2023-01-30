export interface CustomizationProps { }
export interface AnimalType {
    id: string;
    type: string;
}
export interface AnimalSpecies {
    id: string;
    breed: string
}
export interface Medicine {
    id: string;
    medicineName: string;
    usedFor: string;
}
export interface VaccinationType {
    id: string;
    vaccinationType: string
}
export interface AnimalBehaviour {
    id: string;
    behavior: string
}
export interface VaccineInventory {
    id: string;
    kind: string;
    animalType: string;
    vaccineManufacturer: string;
    vaccineSerialNumber: string;
    expirationDate: string;
}
