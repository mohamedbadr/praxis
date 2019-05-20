/// <reference types="crypto-js" />

import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CryptoHelper {

  private key: any;
  private iv: any

  constructor() {

    this.key = CryptoJS.enc.Utf8.parse(environment.cryptoKey);
    this.iv = CryptoJS.enc.Utf8.parse(environment.cryptoKey);
  }

  public encrypt(object: any) {
    const json = JSON.stringify(object);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(json), this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }

}
