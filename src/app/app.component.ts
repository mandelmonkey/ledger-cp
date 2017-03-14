import { Component } from '@angular/core';
import {HTTPService} from "./http.service";
declare var ledger: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[HTTPService],
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  errorText = "";
 comm = ledger.comm_u2f;
userBalance: Array<any>;

constructor(private httpService:HTTPService){}

public connect(){

  document.getElementById("generate").style.display = "none"; 
document.getElementById("loading").style.display = "block"; 

   var httpServiceTmp = this.httpService;
 var errorTextTmp = this.errorText;
var userBalanceTmp = this.userBalance;

   this.comm.create_async().then(function(comm) {

var btc = new ledger.btc(comm);
		
		btc.getWalletPublicKey_async("44'/0'/0'/0").then(function(result) {
		console.log(result.bitcoinAddress);


 httpServiceTmp.getBalance(result.bitcoinAddress).subscribe(
     data => userBalanceTmp = data,
     error => {this.errorText = error},
     () => {
document.getElementById("generate").style.display = "block"; 
document.getElementById("loading").style.display = "none";     
  
}
     
   );


		//document.getElementById("address").innerHTML = result.bitcoinAddress;
	}).fail(function(ex) {
document.getElementById("generate").style.display = "block"; 
document.getElementById("loading").style.display = "none";  

console.log(ex);
document.getElementById("error").innerHTML = "error getting address"
});



}).fail(function(ex) {
document.getElementById("generate").style.display = "block"; 
document.getElementById("loading").style.display = "none";
console.log(ex);

});



}
public runTest() {
this.comm.create_async().then(function(comm) {

var btc = new ledger.btc(comm);

	//this is my unsigedtx I am trying to sign
	var unsginedTX = "01000000021dfb0a283545896680332a0948e8ce50175c31fe673714fd8d08a0ece09d0cb5000000001976a9141294688d320f4dff51bc05218f45f46854bbb0ae88acffffffffd63c333f5d0ba627963f0e37bf953feca1bc28de063b0577a4745a2703434967000000001976a9141294688d320f4dff51bc05218f45f46854bbb0ae88acffffffff0336150000000000001976a914ec9c2b4e92be3842f07a877b2ba9fe232f64d71a88ac00000000000000001e6a1c54db9210edf37c477d94456eea5af2aebb0829115c0e45b8a280d507b8a10000000000001976a9141294688d320f4dff51bc05218f45f46854bbb0ae88ac00000000";

	//this is the first utxo and its output_index
	var utxo1 = "01000000018408f01ae33e43dd5d5804cff3f484993d36bc7555ca5bb95a8acd14ab3f1298020000006b483045022100d0bfd7ec22909a3e8c5db08a047861bebf3bf8c311b4405925bd9c2c56b774b2022010b24e2fb92758bbe8374fa3eaaf2721b523cc7efb959f488b6731186d54314601210273df76238d0675433b7e1ea9efac9f57de87db1102177e69b4a03abcefdb2d29ffffffff0336150000000000001976a9141294688d320f4dff51bc05218f45f46854bbb0ae88ac00000000000000001e6a1cd49ff94423c1c5fd0f9c10324d696a89064694df5602989cd1b472e5181e0600000000001976a914ec9c2b4e92be3842f07a877b2ba9fe232f64d71a88ac00000000";
	var index1 = 0;

	//this is the second utxo and its output_index
	var utxo2 = "0100000001513ec8f855dadc8858504c6eefb4d86b3003aa193be959e3ee3efe1ce7a4636d000000006a4730440220107ac2887153e468bb7e7b1a08453d02c1f4e9177fbc7e246cfb832dea7b0ade02204b07857d1058580bc7cd22a336dc96a8548469de36ca080a4bb16db2a477dcb4012102f0e2d052cbb0818e15465e07d233d6d03be9034ae54ba1a78ffb660a7a553c8bffffffff0228b30100000000001976a9141294688d320f4dff51bc05218f45f46854bbb0ae88ac79d65a04000000001976a914fca63f15c0fa5b87b7661511cd9c60aa6a807ede88ac00000000";
	var index2 = 0;


    var tx1 = btc.splitTransaction(utxo1);

   
	var tx2 = btc.splitTransaction(utxo2);


  	var unsginedTxObject = btc.splitTransaction(unsginedTX);

	var outputscript = btc.serializeTransactionOutputs(unsginedTxObject).toString("hex");

	btc.createPaymentTransactionNew_async([ [tx1,index1],[tx2,index2]],["44'/0'/0'/0","44'/0'/0'/0"], undefined, outputscript).then(function(result) {
		console.log(result);

		document.getElementById("tx").innerHTML = result;

	}).fail(function(ex) {console.log(ex);});



}).fail(function(ex) {console.log(ex);});

}

public getAddress() {

}




/*{"unsigned_tx":"01000000026b01a8f763f546128316cfffe05ccde5631c9fd4ffa457453409ef89fba33a76000000001976a914638c1edba68fad4a877ba21ebf7ac613b437640c88acffffffff2f65c1769f866c2e6ea6278e9b8cedfabaa70374715e6b975648c145e63ba67f000000001976a914638c1edba68fad4a877ba21ebf7ac613b437640c88acffffffff0336150000000000001976a9144d64e73c796d4a06d61b8d80dbd280026758fd2088ac00000000000000001e6a1c70be4c8daeb64fff0901dfe0c1f2cfe51e1b416507d60b7497cfe93944140100000000001976a914638c1edba68fad4a877ba21ebf7ac613b437640c88ac00000000","fee":12400}*/
 ngOnInit(){
 

   

 }

}
