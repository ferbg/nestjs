import { Cipher, createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

import { Injectable } from '@nestjs/common';

import { cryptoConstants } from '../constants';

@Injectable()
export class CryptoService {
  async crypt(textToEncrypt: string): Promise<string> {
    const cipher: Cipher = await this.getCipher();
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);
    return encryptedText.toString();
  }

  private async getCipher() {
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(
      cryptoConstants.secret,
      'salt',
      32,
    )) as Buffer;
    return createCipheriv('aes-256-ctr', key, iv);
  }
}
