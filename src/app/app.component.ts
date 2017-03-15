import { Component, ViewEncapsulation } from '@angular/core';
import {HTTPService} from "./http.service";
declare var ledger: any;
declare var QRCode: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[HTTPService],
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {



feesPerKb:Array<any>;
fees = ["High","Mid","Low"];

selectedFee = "High";
qrCode:any;
setQR = false;
ledgerIndex = "44'/0'/0'/0";
//1Nh4tPtQjHZSoYdToTF7T3xbaKrTNKM3wP
userAddress;
sendAmount ="1.0";
destinationAddress = "1gg14Fiz7uHoxAbAxkBaD2TYkFmGTu73Z";

/*
userAddress = "";
sendAmount ="";
destinationAddress = "";
*/
sendToken = "";
errorConnectText = "";
  errorText = "";
  statusText = "";
 comm = ledger.comm_u2f;
userBalance: Array<any>;

constructor(private httpService:HTTPService){}

public isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
public send(){

 this.errorText = "";
this.statusText = "";
 var self = this;

 

if(this.isNumeric(this.sendAmount) == false){
  this.errorText = "please enter a valid send amount";
  return;
}

if(this.destinationAddress == ""){
   this.errorText = "please enter a destination address";
  return;
}




var sendAmountNum = parseFloat(this.sendAmount);

document.getElementById("loading_send").style.display = "block";
document.getElementById("sendForm").style.display = "none";

if(this.selectedFee == "High"){
var feePerKb = this.feesPerKb["fastestFee"];
}
else if(this.selectedFee == "Medium"){
var feePerKb = this.feesPerKb["halfHourFee"];
}
else if(this.selectedFee == "Low"){
var feePerKb = this.feesPerKb["hourFee"];
}




console.log(feePerKb);
self.statusText = "creating transaction...";

this.httpService.createSendTransaction(this.userAddress,this.destinationAddress,self.sendToken,sendAmountNum,feePerKb,-1).subscribe(
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
    document.getElementById("send_token").style.display = "block";
document.getElementById("destination").style.display = "block";

       },
     error => {
       
       document.getElementById("loading_send").style.display = "none";
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
        console.log("error"+JSON.stringify(error));
     
          console.log("error"+error.json().body); 
            console.log("error:"+error.body.message);
       self.errorText = error.body.message;

   document.getElementById("loading_send").style.display = "none";
document.getElementById("sendForm").style.display = "block";
     
    },
     () => {});



}

public showConnect(show){

  if(show){

  
     document.getElementById("connect").style.display = "none"; 
     document.getElementById("loading").style.display = "block";   


  }
  else{

 
     document.getElementById("connect").style.display = "none"; 
     document.getElementById("loading").style.display = "none";    
    
  
  }

}


public onTabChanged(event){
if(event.index == 1){
if(this.qrCode != null){


this.qrCode.makeCode(this.userAddress); // make another code.

}
else{
       this.qrCode = new QRCode("qrcode",{
    text:this.userAddress,
    width: 300,
    height: 300,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});
     
}
}
  

}
public select(i){


 this.sendToken = this.userBalance[i].token;
 document.getElementById("sendForm").style.display = "block";

}
public connect(){

  var self = this;
  self.errorConnectText = "";
 self.showConnect(true);

 this.comm.create_async().then(function(comm) {

var btc = new ledger.btc(comm);
		
		btc.getWalletPublicKey_async(self.ledgerIndex).then(function(result) {
console.log(result.bitcoinAddress);
self.userAddress = result.bitcoinAddress;

  self.httpService.getBalance(self.userAddress).subscribe(
     data => {
         self.userBalance = data;
       self.httpService.getFees().subscribe(
     data => {
       self.feesPerKb = data;
    console.log(JSON.stringify( self.feesPerKb));

   self.showConnect(false);

   },
     error => {
      document.getElementById("connect").style.display = "block"; 
     document.getElementById("loading").style.display = "none";
       self.errorConnectText = "error connecting to api";},
     () => {});
},    error => {
    document.getElementById("connect").style.display = "block"; 
     document.getElementById("loading").style.display = "none"; 
  self.errorConnectText = "error connecting to api";},
     () => {});


	}).fail(function(ex) {


console.log(ex);
document.getElementById("connect").style.display = "block"; 
     document.getElementById("loading").style.display = "none";
       self.errorConnectText = "error connecting to ledger, see FAQ";
});



}).fail(function(ex) {

console.log(ex);

  document.getElementById("connect").style.display = "block"; 
     document.getElementById("loading").style.display = "none";
       self.errorConnectText = "error connecting to ledger, see FAQ";
});


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
