import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private tempStorage = 'temp-storage';

  setString(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getString(key: string): string {
    return localStorage.getItem(key);
  }

  setObject(key: string, object: any) {
    const value = JSON.stringify(object);
    this.setString(key, value);
  }

  getObject(key: string): any {
    const value = this.getString(key);
    return value ? JSON.parse(value) : null;
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }

  // create session storage used to set value for short navigation terms
  setTempStorage(object: any) {
    sessionStorage.setItem(this.tempStorage, JSON.stringify(object));
  }

  // create session storage used to get value for short navigation terms
  getTempStorage(): any {
    const value = sessionStorage.getItem(this.tempStorage);
    const result = value ? JSON.parse(value) : null;
    sessionStorage.removeItem(this.tempStorage);
    return result;
  }
}

export class StorageKeys {
  static language = 'Praxis:language';
  static cart = 'Praxis:cart';
}
