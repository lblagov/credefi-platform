import { UntypedFormControl } from '@angular/forms';

const keys = ['address', 'crypto', 'id', 'version'];
const crypto = ['cipher', 'cipherparams', 'ciphertext', 'kdf', 'kdfparams', 'mac'];

export function validateKeyStore(c: UntypedFormControl) {
  if (c.value == null || c.value.length == 0) {
    return null;
  }

  try {
    const keystore = JSON.parse(c.value);

    for (let k of keys) {
      if (keystore[k] == null) {
        return {
          keyStore: true
        }
      }
    }

    for (let k of crypto) {
      if (keystore.crypto[k] == null) {
        return {
          keyStore: true
        }
      }
    }

    return null

  } catch (e) {
    console.log(e)
    return {
      keyStore: true
    }
  }

}