import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class HTTPService{
  constructor(private _http:Http){}
    getBalance(address){
      return this._http.get("https://api.indiesquare.me/v2/addresses/"+address+"/balances")
      .map(res=>res.json());
    };

    postJson(){
      var json = JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1
      });
      var params = 'data=' + json;
      var header = new Headers();
      header.append('Content-type', 'application/x-www-form-urlencoded');

      return this._http.post("http://jsonplaceholder.typicode.com/posts",params, {
        headers:header
      })
      .map(res => res.json());
    };

    getUsersByPromise(){
      return this._http.get("http://jsonplaceholder.typicode.com/users")
      .toPromise()
      .then(res=>res.json());
    }
}