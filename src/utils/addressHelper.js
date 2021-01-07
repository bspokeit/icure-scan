import { compact, find } from 'lodash';

export const mainAddress = (addresses) => {
  let address = find(addresses, (a) => {
    return a.addressType === 'home';
  });

  if (!address && addresses.length) {
    address = addresses[0];
  }

  return address;
};

export const addressAsString = (addresses) => {
  const address = mainAddress(addresses);

  if (address) {
    const street = `${address.street} ${address.houseNumber}`.trim();
    const locality = `${address.postalCode} ${address.city}`.trim();

    return compact([street, locality]).join(', ');
  }

  return null;
};
