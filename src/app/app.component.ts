import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { HTTPService } from "./http.service";
declare var ledger: any;
declare var QRCode: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [HTTPService],
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {



  feesPerKb: Array<any>;
  fees = ["High", "Mid", "Low"];
  addressLoaded = false;
  didFinishInputs = false;
  txData = false;
  completion = false;
  connect = true;
  loading = false;
  loadingSend = false;
  sendForm = false;
  confirmTransaction = false;

  decodedTransaction: any;
  currentInputs: any;
  unsginedTX = "";
  actualFee = "";
  selectedFee = "Mid";
  qrCode: any;
  setQR = false;
  ledgerIndex = "44'/0'/0'/0";
  userAddress = "";
  sendAmount = "";
  destinationAddress = "";
  sendToken = "";
  errorConnectText = "";
  errorText = "";
  statusText = "";
  comm = ledger.comm_u2f;
  userBalance: Array<any>;


  constructor(private httpService: HTTPService, private ref: ChangeDetectorRef) { }

  public isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  public send() {

    this.errorText = "";
    this.statusText = "";
    var self = this;



    if (this.isNumeric(this.sendAmount) == false) {
      this.errorText = "please enter a valid send amount";
      return;
    }

    if (this.destinationAddress == "") {
      this.errorText = "please enter a destination address";
      return;
    }




    var sendAmountNum = parseFloat(this.sendAmount);

    self.loadingSend = true;
    self.sendForm = false;

    if (this.selectedFee == "High") {
      var feePerKb = this.feesPerKb["fastestFee"];
    }
    else if (this.selectedFee == "Mid") {
      var feePerKb = this.feesPerKb["halfHourFee"];
    }
    else if (this.selectedFee == "Low") {
      var feePerKb = this.feesPerKb["hourFee"];
    }




    console.log(feePerKb);
    self.statusText = "creating transaction...";
    self.ref.detectChanges();

    this.httpService.createSendTransaction(this.userAddress, this.destinationAddress, self.sendToken, sendAmountNum, feePerKb, -1).subscribe(
      data => {
        self.unsginedTX = data.unsigned_tx;

        self.actualFee = data.fee;

        self.loadingSend = false;
        self.confirmTransaction = true;

      },
      error => {

        self.loadingSend = false;
        self.sendForm = true;
        self.ref.detectChanges();
        var errorBody = error._body;
        if (errorBody != null) {
          var message = JSON.parse(error._body).message;
          if (message != null) {
            self.errorText = message;
          } else {
            self.errorText = error;
          }
        }
        else {
          self.errorText = error;
        }


        self.ref.detectChanges();


      },
      () => { });



  }

  public signAndBroadcast() {

    console.log("cp" + JSON.stringify(this.currentInputs));

    var self = this;
    self.statusText = "verifying inputs...";
    self.ref.detectChanges();
    this.comm.create_async().then(function(comm) {

      var btc = new ledger.btc(comm);
      var inputsArray = [];
      var keyPathArray = [];

      for (var i = 0; i < self.currentInputs.length; i++) {
        var currentInput = self.currentInputs[i];

        var anInputObject = btc.splitTransaction(currentInput.txhex);
        var inputIndex = currentInput.vout;
        var inputObject = [];
        inputObject.push(anInputObject);
        inputObject.push(inputIndex);
        inputsArray.push(inputObject);

        keyPathArray.push(self.ledgerIndex);
      }

      console.log("creating objects");

      var unsginedTxObject = btc.splitTransaction(self.unsginedTX);

      var outputscript = btc.serializeTransactionOutputs(unsginedTxObject).toString("hex");



      self.statusText = "please confirm on ledger";

      self.ref.detectChanges();
      setTimeout(function() {
        self.ref.detectChanges();
      }, 500);
      outputscript += "x";
      console.log("creating payment");
      console.log(inputsArray);
      console.log(keyPathArray);
      console.log(outputscript);
      btc.createPaymentTransactionNew_async(inputsArray, keyPathArray, undefined, outputscript).then(function(result) {



        console.log(result);
        self.statusText = "broadcasting...";
        self.ref.detectChanges();
        self.httpService.broadcastTransaction(result).subscribe(
          data => {

            console.log(JSON.stringify(data));

            self.showCompletion();
            self.ref.detectChanges();

          },
          error => {
            self.loadingSend = false;
            self.sendForm = true;
            self.ref.detectChanges();
            var errorBody = error._body;
            if (errorBody != null) {
              var message = JSON.parse(error._body).message;
              if (message != null) {
                self.errorText = message;
              } else {
                self.errorText = error;
              }
            }
            else {
              self.errorText = error;
            }


            self.ref.detectChanges();

            console.error(error);
          },
          () => { });




      }).fail(function(ex) {

        self.setLedgerError();


        console.log(ex);


      });



    }).fail(function(ex) {


      self.setLedgerError();

      console.log(ex);

    });



  }
  public setLedgerError() {
    var self = this;
    this.loadingSend = false;
    this.sendForm = true;
    this.errorText = "error connecting to ledger, see FAQ";
    this.ref.detectChanges();


  }
  public showCompletion() {


    this.loadingSend = false;
    this.sendForm = false;
    this.completion = true;

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
    for (var i = 0; i < this.currentInputs.length; i++) {

      var aCurrentInput = this.currentInputs[i];
      if (typeof aCurrentInput.txhex == "undefined") {
        allInputsFound = false;
        if (typeof aCurrentInput.collection == "undefined") {
          this.getAnInput(aCurrentInput);
        }

      }


    }

    if (allInputsFound && this.didFinishInputs == false) {
      this.didFinishInputs = true;
      this.signAndBroadcast();
    }

  }

  public reset() {

    this.completion = false

    this.loadingSend = false;
    this.sendForm = false;
    this.confirmTransaction = false;

    this.decodedTransaction = [];
    this.currentInputs = [];
    this.unsginedTX = "";
    this.actualFee = "";
    this.selectedFee = "Mid";

    this.sendAmount = "";
    this.destinationAddress = "";

    this.sendToken = "";
    this.errorConnectText = "";
    this.errorText = "";
    this.statusText = "";
    this.userBalance = [];

    this.connectLedger();

  }

  public continueTransaction() {




    var self = this;

    self.loadingSend = true;
    self.sendForm = false;
    self.confirmTransaction = false;
    self.statusText = "decoding transaction...";
    self.ref.detectChanges();
    this.httpService.decodeRawTransaction(self.unsginedTX).subscribe(
      data => {
        console.log("decodedr:" + JSON.stringify(data));
        self.decodedTransaction = data;




        self.currentInputs = self.decodedTransaction.vin;
        console.log(JSON.stringify(this.currentInputs));
        self.didFinishInputs = false;
        this.statusText = "collecting inputs...";

        self.getCurrentInputsTx();




      },
      error => {
        console.log("decode error" + error);
        self.loadingSend = false;

        self.sendForm = true;

        self.ref.detectChanges();
        var errorBody = error._body;
        if (errorBody != null) {
          var message = JSON.parse(error._body).message;
          if (message != null) {
            self.errorText = message;
          } else {
            self.errorText = error;
          }
        }
        else {
          self.errorText = error;
        }


        self.ref.detectChanges();


      },
      () => { });








  }

  public showTxData() {
    this.txData = true;
  }

  public showConnect(show) {

    if (show) {


      this.connect = false;
      this.loading = true;


    }
    else {


      this.connect = true;

      this.loading = false;


    }

  }


  public onTabChanged(event) {
    if (this.addressLoaded) {
      if (event.index == 1) {
        if (this.qrCode != null) {


          this.qrCode.makeCode(this.userAddress); // make another code.

        }
        else {
          this.qrCode = new QRCode("qrcode", {
            text: this.userAddress,
            width: 300,
            height: 300,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        }
      }
    }


  }
  public select(i) {


    this.sendToken = this.userBalance[i].token;
    this.sendForm = true;

  }
  public connectLedger() {



    var self = this;

    self.errorConnectText = "";
    self.connect = false;
    self.loading = true;

    this.comm.create_async().then(function(comm) {
      var btc = new ledger.btc(comm);
      btc.getWalletPublicKey_async(self.ledgerIndex).then(function(result) {
        console.log(result.bitcoinAddress);
        self.userAddress = result.bitcoinAddress;
        self.addressLoaded = true;
        self.httpService.getBalance(self.userAddress).subscribe(
          data => {

            self.userBalance = data;
            self.httpService.getFees().subscribe(
              data => {
                self.feesPerKb = data;
                console.log(JSON.stringify(self.feesPerKb));

                self.loading = false;
                self.ref.detectChanges();
              },
              error => {
                self.connect = true;
                self.loading = false;
                self.errorConnectText = "error connecting to api";
                self.ref.detectChanges();
              },
              () => { });
          }, error => {
            self.connect = true;
            self.loading = false;
            self.errorConnectText = "error connecting to api";
            self.ref.detectChanges();
          },
          () => { });


      }).fail(function(ex) {


        console.log(ex);

        self.connect = true;
        self.loading = false;

        self.errorConnectText = "error connecting to ledger, see FAQ";
        self.ref.detectChanges();
      });



    }).fail(function(ex) {

      console.log(ex);

      self.connect = true;
      self.loading = false;

      self.errorConnectText = "error connecting to ledger, see FAQ";
      self.ref.detectChanges();
    });


  }

  ngOnInit() {




  }

}
