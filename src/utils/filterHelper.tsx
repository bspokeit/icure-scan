// import { Filter } from '@icure/api';

// export interface FilterExt extends Filter {
//   $type: string;
//   healthcarePartyId?: string;
//   searchString?: string;
//   dateOfBirth?: number;
//   ssin?: string;
//   ssins?: string[];
//   name?: string;
//   active?: boolean;
//   filters?: Array<FilterExt>;
// }

// export interface FilterDefinition extends Filter {
//   $type?: FilterType;
//   tagType?: string;
//   tagCode?: string;
//   codeType?: string;
//   codeNumber?: string;
//   filters?: FilterDefinition[];
//   translationKey?: string;
//   status?: number;
// }

export enum FilterType {
  ServiceByHcPartyTagCodeDateFilter = 'ServiceByHcPartyTagCodeDateFilter',
  UnionFilter = 'UnionFilter',
  PatientByHcPartyAndSsinsFilter = 'PatientByHcPartyAndSsinsFilter',
  PatientByHcPartyNameContainsFuzzyFilter = 'PatientByHcPartyNameContainsFuzzyFilter',
}

// export const buildIntersectionFilter = (
//   arrayOfValues: IntersectionFilterParams[]
// ) => {
//   return {
//     $type: FilterType.IntersectionFilter,
//     filters: arrayOfValues.map(([$type, healthcarePartyId, valueParam]) => ({
//       $type,
//       healthcarePartyId,
//       ...valueParam,
//     })),
//   };
// };
