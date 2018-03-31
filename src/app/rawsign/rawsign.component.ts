import { Component, ViewEncapsulation, ChangeDetectorRef, OnInit } from '@angular/core';
import { HTTPService } from "../http.service";

import TransportU2F from "@ledgerhq/hw-transport-u2f";
import Btc from "@ledgerhq/hw-app-btc";


@Component({
  selector: 'app-rawsign',
  templateUrl: './rawsign.component.html',
  styleUrls: ['./rawsign.component.css']
})
export class RawsignComponent implements OnInit {

  constructor(private httpService: HTTPService, private ref: ChangeDetectorRef) { }

  btc: any;
  loadingSendCustom = false;
  sendButtonCustom = true;
  statusTextCustom = "";
  unsignedTxCustom = "";
  decodedTransactionCustom: any;
  currentInputsCustom = [];
  didFinishInputsCustom = false;
  errorTextCustom = "";

  ledgerIndex = "44'/0'/0'/0";
  public signSend() {

    this.statusTextCustom = "";
    this.errorTextCustom = "";
    if (this.unsignedTxCustom == "") {
      this.errorTextCustom = "please enter an unsigned tx hex";
      return;
    }


    var self = this;

    self.loadingSendCustom = true;
    self.sendButtonCustom = false;
    self.statusTextCustom = "decoding transaction...";
    self.ref.detectChanges();
    this.httpService.decodeRawTransaction(self.unsignedTxCustom).subscribe(
      data => {
        console.log("decodedr:" + JSON.stringify(data));
        self.decodedTransactionCustom = data;




        self.currentInputsCustom = self.decodedTransactionCustom.vin;
        console.log(JSON.stringify(this.currentInputsCustom));
        self.didFinishInputsCustom = false;
        this.statusTextCustom = "collecting inputs...";

        self.getCurrentInputsTx();




      },
      error => {
        console.log("decode error" + error);
        var errorBody = error._body;

        self.loadingSendCustom = false;

        self.sendButtonCustom = true;
        if (errorBody != null) {
          var message = JSON.parse(error._body).message;
          if (message != null) {
            self.errorTextCustom = message;
          } else {
            self.errorTextCustom = error;
          }
        }
        else {
          self.errorTextCustom = error;
        }

        self.ref.detectChanges();


      },
      () => { });








  }



  public getAnInput(aCurrentInput) {
    aCurrentInput["collecting"] = true;
    this.httpService.getRawTransaction(aCurrentInput.txid).subscribe(
      data => {

        aCurrentInput["txhex"] = data[0];
        this.getCurrentInputsTx();
      },
      error => {
        delete aCurrentInput["collecting"];
        this.getAnInput(aCurrentInput);

      },
      () => { });
  }

  public getCurrentInputsTx() {


    this.ref.detectChanges();
    var allInputsFound = true;
    for (var i = 0; i < this.currentInputsCustom.length; i++) {

      var aCurrentInput = this.currentInputsCustom[i];
      if (typeof aCurrentInput.txhex == "undefined") {
        allInputsFound = false;
        if (typeof aCurrentInput.collection == "undefined") {
          this.getAnInput(aCurrentInput);
        }

      }


    }

    if (allInputsFound && this.didFinishInputsCustom == false) {
      this.didFinishInputsCustom = true;
      this.signAndBroadcast();
    }

  }


  public signAndBroadcast() {

    console.log("cp" + JSON.stringify(this.currentInputsCustom));

    var self = this;
    self.statusTextCustom = "verifying inputs...";
    self.ref.detectChanges();
    if (TransportU2F.isSupported()) {

      TransportU2F.create().then(function(transport) {

        self.btc = new Btc(transport);

        var inputsArray = [];
        var keyPathArray = [];

        for (var i = 0; i < self.currentInputsCustom.length; i++) {
          var currentInput = self.currentInputsCustom[i];

          var anInputObject = self.btc.splitTransaction(currentInput.txhex);
          var inputIndex = currentInput.vout;
          var inputObject = [];
          inputObject.push(anInputObject);
          inputObject.push(inputIndex);
          inputsArray.push(inputObject);

          keyPathArray.push(self.ledgerIndex);
        }

        console.log("creating objects");

        var unsginedTxObject = self.btc.splitTransaction(self.unsignedTxCustom);

        var outputscript = self.btc.serializeTransactionOutputs(unsginedTxObject).toString("hex");

        self.statusTextCustom = "please confirm on ledger";

        self.ref.detectChanges();

        console.log("creating payment");
        self.btc.createPaymentTransactionNew(inputsArray, keyPathArray, undefined, outputscript).then(function(result) {



          console.log(result);
          self.statusTextCustom = "broadcasting...";
          self.ref.detectChanges();
          self.httpService.broadcastTransaction(result).subscribe(
            data => {

              console.log(JSON.stringify(data));

              self.statusTextCustom = "Broadcast: " + JSON.stringify(data)
              self.loadingSendCustom = false;
              self.sendButtonCustom = true;
              self.ref.detectChanges();



            },
            error => {


              var errorBody = error._body;
              self.errorTextCustom = error;
              if (errorBody != null) {
                var message = JSON.parse(error._body).message;
                if (message != null) {
                  self.errorTextCustom = message;
                } else {
                  self.errorTextCustom = error;
                }
              }
              else {
                self.errorTextCustom = error;
              }

              self.loadingSendCustom = false;
              self.sendButtonCustom = true;
              self.ref.detectChanges();

              console.log(error);
            },
            () => { });




        }).catch(function(error) {
          console.log(error);
          self.loadingSendCustom = false;
          self.sendButtonCustom = true;
          self.errorTextCustom = "error connecting to ledger, see FAQ";
          self.ref.detectChanges();




        });



      }).catch(function(error) {

        console.log(error);

        self.loadingSendCustom = false;
        self.sendButtonCustom = true;
        self.errorTextCustom = "error connecting to ledger, see FAQ";
        self.ref.detectChanges();

      });

    } else {
      alert("Your browser is not compatible with the ledger");
    }



  }


  ngOnInit() {
  }

}


