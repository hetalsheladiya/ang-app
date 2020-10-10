import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './../user';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  base_url : string = "http://localhost:3000/api";

  constructor(
    private http: HttpClient
  ) { }
  login (user : User) {
    return this.http.post<User>(`${this.base_url}/auth/login`, user)
    // .pipe(
    //   map((data : any) => {
    //     return data;
    //   }),
    //   catchError(error => {
    //     return throwError( 'Something went wrong!' );
    //   })
    // );
  }
  register (user: User) {
    return this.http.post<User>(`${this.base_url}/auth/register`, user);
  }

}
