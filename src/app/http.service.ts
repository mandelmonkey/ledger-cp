import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class HTTPService{
    apiKey = "f29809821767e00b19e887e762e78e01";
  constructor(private _http:Http){}
    
    getBalance(address){
      return this._http.get("https://api.indiesquare.me/v2/addresses/"+address+"/balances?X-Api-Key=" + this.apiKey)
      .map(res=>res.json());
    };

     getFees(){
      return this._http.get("https://api.indiesquare.me/v2/fees/recommended?X-Api-Key=" + this.apiKey)
      .map(res=>res.json());
    };

    broadcastTransaction(tx){
       var json = JSON.stringify({
             tx: tx,
        });

      var params = json;
      var header = new Headers();
      header.append('Content-type', 'Content-Type: application/json');

      return this._http.post("https://api.indiesquare.me/v2/transactions/broadcast?X-Api-Key=" + this.apiKey,params, {
        headers:header
      })
      .map(res => res.json());
    };

    getRawTransactions(address){
      return this._http.get("https://api.indiesquare.net/v2/addresses/"+address+"/rawtransactions?X-Api-Key=" + this.apiKey)
      .map(res=>res.json());
    };


    decodeRawTransaction(tx){
        
      var json = JSON.stringify({
             tx: tx,
        });

      var params = json;
      var header = new Headers();
      header.append('Content-type', 'Content-Type: application/json');

      return this._http.post("https://api.indiesquare.me/v2/transactions/decode?X-Api-Key=" + this.apiKey,params, {
        headers:header
      })
      .map(res => res.json());
    };

   


    createSendTransaction(source,destination,token,quantity,fee_per_kb,fee){
        if(fee != -1){
            var json = JSON.stringify({
              source: source,
              destination: destination,
              token: token,
              quantity:quantity,
              fee:fee,
            });
        }
        else{
          var json = JSON.stringify({
              source: source,
              destination: destination,
              token: token,
              quantity:quantity,
              fee_per_kb:fee_per_kb,
            });
        }
      var params = json;
      var header = new Headers();
      header.append('Content-type', 'Content-Type: application/json');

      return this._http.post("https://api.indiesquare.me/v2/transactions/send",params, {
        headers:header
      })
      .map(res => res.json());
    };

}