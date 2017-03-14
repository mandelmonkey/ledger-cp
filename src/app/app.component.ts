import { Component } from '@angular/core';
import {HTTPService} from "./http.service";
declare var ledger: any;
declare var QRCode: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[HTTPService],
  styleUrls: ['./app.component.css']
})

export class AppComponent {


ledgerIndex = "44'/0'/0'/0";
userAddress = "1Nh4tPtQjHZSoYdToTF7T3xbaKrTNKM3wP";
sendAmount ="1.0";
destinationAddress = "1gg14Fiz7uHoxAbAxkBaD2TYkFmGTu73Z";
  errorText = "";
 comm = ledger.comm_u2f;
userBalance: Array<any>;

constructor(private httpService:HTTPService){}


public send(i){
 var self = this;

 var tokenName = this.userBalance[i].token;
 
document.getElementById("loading_send").style.display = "block";
document.getElementById("send_"+tokenName).style.display = "none";

document.getElementById("send_token").style.display = "none";
document.getElementById("destination").style.display = "none";

var sendAmountNum = parseFloat(this.sendAmount);

console.log(" "+this.userAddress+" "+this.destinationAddress+" "+tokenName+" "+sendAmountNum);
this.httpService.createSendTransaction(this.userAddress,this.destinationAddress,tokenName,sendAmountNum,10000,10000).subscribe(
     data => {
   
   

    var unsginedTX = data.unsigned_tx;
    this.httpService.decodeRawTransaction(unsginedTX).subscribe(
     data => {
  console.log("decodedr:"+JSON.stringify(data));
var decodedTransaction = data;

   this.httpService.getRawTransactions(this.userAddress).subscribe(
     data => {

var currentInputs = decodedTransaction.vin;
var numOfInputsFound = 0;
for(var i = 0;i<data.length;i++){
    var aUTXO = data[i];

    for(var i2 = 0;i2<currentInputs.length;i2++){
      var aCurrentInput = currentInputs[i2];
      if(aUTXO.txid == aCurrentInput.txid){
        aCurrentInput["txhex"] = aUTXO.hex;
      }

    }
    

}


console.log("ci: "+JSON.stringify(currentInputs));






this.comm.create_async().then(function(comm) {

var btc = new ledger.btc(comm);
var inputsArray = [];
var keyPathArray = [];

	for(var i = 0;i<currentInputs.length;i++){
    var currentInput = currentInputs[i];
  
    var anInputObject = btc.splitTransaction(currentInput.txhex);
    var inputIndex = currentInput.vout;
    var inputObject = [];
    inputObject.push(anInputObject);
     inputObject.push(inputIndex);
    inputsArray.push(inputObject);

      keyPathArray.push(self.ledgerIndex);
  }
   


  	var unsginedTxObject = btc.splitTransaction(unsginedTX);

	var outputscript = btc.serializeTransactionOutputs(unsginedTxObject).toString("hex");

	btc.createPaymentTransactionNew_async(inputsArray,keyPathArray, undefined, outputscript).then(function(result) {
		
    console.log(result);

   self.httpService.broadcastTransaction(result).subscribe(
     data => {
  
            console.log(JSON.stringify(data));

            document.getElementById("loading_send").style.display = "none";
    document.getElementById("send_"+tokenName).style.display = "block";
    document.getElementById("send_token").style.display = "block";
document.getElementById("destination").style.display = "block";

       },
     error => {
       
       document.getElementById("loading_send").style.display = "none";
    document.getElementById("send_"+tokenName).style.display = "block";
    document.getElementById("send_token").style.display = "block";
document.getElementById("destination").style.display = "block";
       
       console.log(error);},
     () => {});




	}).fail(function(ex) {console.log(ex);});



}).fail(function(ex) {console.log(ex);});












 


   },
     error => {
        console.log("decode error"+error);
      
    },
     () => {});

  


/*

*/




   },
     error => {
        console.log("decode error"+error);
      
    },
     () => {});

  








   },
     error => {
        console.log("error"+error);
       this.errorText = error

       document.getElementById("loading_send").style.display = "none";
       document.getElementById("send_"+tokenName).style.display = "block";
       document.getElementById("send_token").style.display = "block";
document.getElementById("destination").style.display = "block";
     
    },
     () => {});



}

public showConnect(show){

  if(show){

     document.getElementById("address_info").style.display = "none"; 
     document.getElementById("generate").style.display = "none"; 
     document.getElementById("loading").style.display = "block";    
     document.getElementById("send_token").style.display = "none";
     document.getElementById("destination").style.display = "none";


  }
  else{

     document.getElementById("address_info").style.display = "block"; 
     document.getElementById("generate").style.display = "block"; 
     document.getElementById("loading").style.display = "none";    
     document.getElementById("send_token").style.display = "block";
     document.getElementById("destination").style.display = "block";
  
  }

}

public connect(){
var self = this;
 self.showConnect(true);


var qrcode = new QRCode("qrcode");
 qrcode.makeCode(this.userAddress);

  self.httpService.getBalance(self.userAddress).subscribe(
     data => {self.userBalance = data;
   self.showConnect(false);
},
     error => {self.errorText = error},
     () => {});


/*
 


   this.comm.create_async().then(function(comm) {

var btc = new ledger.btc(comm);
		
		btc.getWalletPublicKey_async("44'/0'/0'/0").then(function(result) {
		console.log(result.bitcoinAddress);
self.userAddress = result.bitcoinAddress;


var qrcode = new QRCode("qrcode");
 qrcode.makeCode(this.userAddress);


  self.httpService.getBalance(self.userAddress).subscribe(
     data => {self.userBalance = data;
     document.getElementById("generate").style.display = "block"; 
document.getElementById("loading").style.display = "none";    },
     error => {self.errorText = error},
     () => {});

	}).fail(function(ex) {
document.getElementById("generate").style.display = "block"; 
document.getElementById("loading").style.display = "none";  

console.log(ex);
self.errorText = "error getting address"
});



}).fail(function(ex) {
document.getElementById("generate").style.display = "block"; 
document.getElementById("loading").style.display = "none";
console.log(ex);
self.errorText = "error getting connecting to ledger"
});


*/
}


 ngOnInit(){
  



 }

}
