import { Address } from '@icure/api';
import { compact, find, first } from 'lodash';

export const mainAddress = (addresses?: Address[]): Address => {
  return (
    find(addresses, (a) => {
      return a.addressType === Address.AddressTypeEnum.Home;
    }) ??
    first(addresses) ??
    new Address({})
  );
};

export const addressAsString = (addresses?: Address[]): string => {
  const address = mainAddress(addresses);

  if (address) {
    const street = `${address?.street || ''} ${
      address?.houseNumber || ''
    }`.trim();
    const locality = `${address?.postalCode || ''} ${
      address?.city || ''
    }`.trim();

    return compact([street, locality]).join(', ');
  }

  return '';
};
