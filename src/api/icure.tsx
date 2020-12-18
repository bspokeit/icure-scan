import isoCrypto from 'isomorphic-webcrypto';
import { Api } from '@icure/api';

const getICureApi = async (): Promise<any> => {
  console.log('cdscdscdscds');
  await isoCrypto.ensureSecure();
  const host = 'https://kraken.svc.icure.cloud/rest/v1';
  return Api(host, 'demo', 'demo', isoCrypto);
};

export default getICureApi;
