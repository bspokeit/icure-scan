import iCureAPI from '../api/icure';

export const validateKeyForHcp = (hcpId) => {
  const randomString = Math.random().toString(36).substring(2);

  console.log('randomString: ', randomString);
  let userCryptoKey = null;

  return iCureAPI
    .getHcpAPI()
    .getHcPartyKeysForDelegate(hcpId)
    .then((encryptedHcPartyKey) =>
      iCureAPI
        .getCryptoAPI()
        .decryptHcPartyKey(hcpId, hcpId, encryptedHcPartyKey[hcpId], true)
    )
    .then((importedAESHcPartyKey) => {
      userCryptoKey = importedAESHcPartyKey.key;
      return iCureAPI
        .getCryptoAPI()
        .AES.encrypt(
          userCryptoKey,
          iCureAPI.getCryptoAPI().utils.text2ua(randomString)
        );
    })
    .then((cryptedString) => {
      return iCureAPI.getCryptoAPI().AES.decrypt(userCryptoKey, cryptedString);
    })
    .then((decription) => {
      return Promise.resolve(
        iCureAPI.getCryptoAPI().utils.ua2text(decription) === randomString
      );
    })
    .catch(() => Promise.resolve(false));
};
