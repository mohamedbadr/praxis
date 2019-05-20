import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private readonly apiUrl: string;

  constructor(
    private httpClient: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  // Method that creates the header options for post requests
  private createPostAndPutHeaderOptions(contentType: string): any {
    const requestHeaders = new HttpHeaders();

    if (contentType !== null) {
      requestHeaders.set('Content-Type', contentType);
    }

    return { headers: requestHeaders };
  }

  // Base get method
  public get(url: string): Observable<any> {
    const requestUrl = `${this.apiUrl}/${url}`;
    return this.httpClient.get(requestUrl);
  }

  public getFile(url: string) {
    const requestUrl = `${this.apiUrl}/${url}`;
    return this.httpClient.get(requestUrl, {
      responseType: 'blob'
    });
  }

  // Base post method
  public post(url: string, data: any, contentType: string = 'application/json'): Observable<any> {
    const requestUrl = `${this.apiUrl}/${url}`;
    const options = this.createPostAndPutHeaderOptions(contentType);
    return this.httpClient.post(requestUrl, data, options);
  }

  // Base put method
  public put(url: string, data: any, contentType: string = 'application/json'): Observable<any> {
    const requestUrl = `${this.apiUrl}/${url}`;
    const options = this.createPostAndPutHeaderOptions(contentType);
    return this.httpClient.put(requestUrl, data, options);
  }

  public delete(url: string, contentType: string = 'application/json'): Observable<any> {
    const requestUrl = `${this.apiUrl}/${url}`;
    const options = this.createPostAndPutHeaderOptions(contentType);
    return this.httpClient.delete(requestUrl, options);
  }

  // Base post to token url method
  public postToTokenUrl(data: any): Observable<any> {
    const contentType = 'application/x-www-form-urlencoded';
    // const options = this.createPostAndPutHeaderOptions('', contentType, false);


    return this.httpClient.post(`${this.apiUrl}/token`, data);
  }
}
