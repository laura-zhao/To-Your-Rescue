import React from 'react';

/* eslint-disable no-unused-vars */
export interface AnimalsProps {
  getAnimalListLoading: boolean,
  getAnimalListSuccess: boolean,
  animalList: [],
  pcoList: [],
  totalNumber: number,
  currentPage: number,
  setSelectedAnimal: any,
  selectedAnimalId: string,
  selectedPcoId: string,
  addAnimalLoading: boolean,
  updateAnimalLoading: boolean,
  addAnimalSuccess: boolean,
  setSelectedPcoId: any,
  getAnimalListCall: any,
  getAnimalListSuggestionCall: any,
  addAnimalCall: any,
  updateAnimalCall: any,
  deleteAnimalCall: any,
  uploadImageCall: any,
  deleteImageCall: any,
}

export type ResidentType = 'former' | 'current';
export type TableFilterTypes = 'all' | ResidentType;
export type GenderOpts = 'males' | 'females' | 'unknown';
export interface TableFilterOptions {
  id: TableFilterTypes;
  name: string;
}
export interface DataType {
  key: React.Key;
  id: number;
  name: string;
  type: string;
  breed: string;
  gender: string;
  birthdate: string;
  location: string;
  lastMilestone: string;
  story: string;
  flag: string;
}

export interface RowSelection {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => any;
  getCheckboxProps: (record: DataType) => any;
}

export interface ApiResponseAnimal {
  id: number
  tenantId: number
  name: string
  type: string
  breed: string
  color: string
  gender: string
  birthday: string
  location: string
  isFlagged: boolean
  flag: string
  isSpayedNeutered: boolean
  Story: string
  note: string
  profilePhotoUrl: string
  intakeDate: string
  acquiredHow: string
  amountPaid: number
  amountReceived: number
  intakeNote: string
}

export interface AnimalTableData extends ApiResponseAnimal {
  key: React.Key;
  resident: string;
}
