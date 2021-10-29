import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  readonly URI: string = "https://restcountries.com/v3.1/";
  public static orgData: any = [];
  public static mapCountry: Map<string, string> = new Map();
  
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(`${this.URI}/all`).pipe(map(res => {
      RestService.orgData = res;
      this.processData();
      return RestService.orgData;
    }));
  }

  getOrgData() {
    return RestService.orgData;
  }

  filterByRegion(region: string) {
    return this.http.get(`${this.URI}/region/${region}`);
  }

  searchByName(name: string) {
    return this.http.get(`${this.URI}/name/${name}`);
  }

  processData() {
    if (RestService.orgData) {
      RestService.orgData.forEach((data: any) => {
        RestService.mapCountry.set(data.cca3, data.name.common);
      });
    }
  }

  getFullName(key: string) {
    return RestService.mapCountry.get(key);
  }

  hasData() {
    if (RestService.orgData.length > 0) {
      return true;
    } else {
      return false;
    }
  }

}
