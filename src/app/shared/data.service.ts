
import {Injectable} from '@angular/core';
@Injectable()
export class DataService {
 
  alertText:string;




title = "";
  subTitle = "";
  instruc1 = "";
   instruc1Warning = "*make sure to enter token name correctly";
   instruc2 = "";
    instruc3 = "";

    instruc4 = "";
    instrucBitSplit= "";
    instruc5= "";
    chooseFile = "";

    giftCardHowToClaim = "";
     giftCardHowToClaim1 = "";
      giftCardHowToClaim2 = "";


       giftCardPrintMeInstructions = "Instructions";
        giftCardPrintMeInstructions2 = "Below are the giftcards for you to print and distribute\nAfter that there is a seperate sheet with instructions on how to charge each giftcard";


      giftCardHowToCharge= "";
       giftCardChargeInstructions = "Each qr code below represents a giftcard\nTo charge use indiesquare wallet and scan each qrcode with the “systemlinkage” button\nYou can use bitsplit.csv to check charge status or to charge via tokenly's bitsplit tool"
    
      


   charged = "";
loading = "";


 error1 = "";
    error2= "";
     error3= "";
    error4= "";
  
   constructor(){
    

    var userLang = navigator.language;
     console.log("lang"+userLang);
    if(userLang == "ja-JP"){
     

    this.setJapanese();

    }else{
      this.setEnglish();
    }




  }
  

  setEnglish(){


    this.title = "Counterparty Ledger";
    this.subTitle = "Receive and send counterpaty tokens to your ledger nano s";
    this.instruc1 = "1.Enter amount and token";
    this.instruc1Warning = "*make sure to enter token name correctly";
    this. instruc2 = "2.Upload a token image";
     this. instruc3 = "3. Number of giftcards to generate";

     this. instruc4 = "4.After pressing \"Generate\" a printable pdf of the gift cards will be downloaded along with charge instructions ";
     this. instrucBitSplit = "(an optional bitsplit csv for batch charging will also be downloaded)";
     this. instruc5 = "5.After printing, charging and distributing the giftcards users can sweep the token via IndieSquare Wallet or Book of Orbs";
     this. chooseFile = "Choose file";

      this.giftCardHowToClaim = "How to claim";
      this. giftCardHowToClaim1 = "1. Download and open IndieSquare Wallet or Book of Orbs";
       this. giftCardHowToClaim2 = "2. Press 'System Linkage' in settings and scan the code above";
      this.loading = "generating...";

       this. giftCardHowToCharge = "How to charge";
    
     this.charged = "Charged?";


       this.giftCardPrintMeInstructions = "Instructions";
        this.giftCardPrintMeInstructions2 = "Below are the giftcards for you to print and distribute\nFollowing that there is a seperate sheet with instructions on how to charge each giftcard";


   this.error1 = "please enter a token amount and name";
     this. error2 = "please enter a in the format NUM TOKENNAME e.g. 1 BITCRYSTAL";
      this. error3 = "please upload an image";
     this. error4 = "please enter a quantity between 1 and 1000";
  


}


setJapanese(){


      this.title = "werwer";
   this.subTitle = "werwerds";
   this.instruc1 = "qwerewqn";
    this.instruc1Warning = "*make sure to enter token name correctly";
   this. instruc2 = "qewrqwerqwre";
    this. instruc3 = "3. Number of giftcards to generate";

    this. instruc4 = "dsfdsfg \"Generate\" a printable pdf of the gift cards will be downloaded, along with a pdf of charge instructions ";
    this. instrucBitSplit = "(an optional bitsplit csv for batch charging will also be downloaded)";
    this. instruc5 = "5.After printing, charging and distributing the giftcards users can sweep the token via IndieSquare Wallet or Book of Orbs";
    this. chooseFile = "Choose file";

     this.giftCardHowToClaim = "How to claim";
     this. giftCardHowToClaim1 = "1. Download and open IndieSquare Wallet or Book of Orbs";
     this.  giftCardHowToClaim2 = "2. Press 'System Linkage' in settings and scan the code above";


     this.  giftCardHowToCharge = "How to charge";
    

      this.giftCardPrintMeInstructions = "Instructions";
        this.giftCardPrintMeInstructions2 = "Below are the giftcards for you to print and distribute\nFollowing that there is a seperate sheet with instructions on how to charge each giftcard";


   this. charged = "Charged?";
  this.loading = "loading...";


 this. error1 = "please enter a token amount and name";
   this.  error2 = "please enter a in the format NUM TOKENNAME e.g. 1 BITCRYSTAL";
    this.  error3 = "please upload an image";
    this. error4 = "please enter a quantity between 1 and 1000";


}
    

}