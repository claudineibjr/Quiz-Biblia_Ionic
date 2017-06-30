import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  email: string;
  password: string;

  userProfile: any = null;

  constructor(public navCtrl: NavController, public firebaseAuthentication: AngularFireAuth, public toastCtrl: ToastController, private facebook: Facebook) {
    this.doLogin(); //DEBUG
  }

  facebookLogin(){
      this.facebook.login(['email']).then( (response) => {
          const facebookCredential = firebase.auth.FacebookAuthProvider
              .credential(response.authResponse.accessToken);

          firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
              console.log("Firebase success: " + JSON.stringify(success));

              let toastMessage = this.toastCtrl.create({
                        message: "Firebase success: " + JSON.stringify(success),
                        duration: 3000
                      });
                
              toastMessage.present();

              this.userProfile = success;
          })
          .catch((error) => {
              console.log("Firebase failure: " + JSON.stringify(error));
              let toastMessage = this.toastCtrl.create({
                        message: "Firebase failure: " + JSON.stringify(error),
                        duration: 3000
                      });  

              toastMessage.present();
          });

      }).catch((error) => { 
        console.log(error)
        let toastMessage = this.toastCtrl.create({
                  message: error,
                  duration: 3000
                });                      
      });
  }

  createUser(){

    this.firebaseAuthentication.auth.createUserWithEmailAndPassword(this.email, this.password).then((success => {
      
    })).catch((error =>{
      
    }));

  }

  doLogin(){
    this.navCtrl.push(TabsPage);

    /*this.firebaseAuthentication.auth.signInWithEmailAndPassword(this.email, this.password).then((success => {
      let toastMessage = this.toastCtrl.create({
                message: success.message,
                duration: 3000
              });
      
      toastMessage.present();

      this.navCtrl.push(TabsPage);
    })).catch((error => {
      let toastMessage = this.toastCtrl.create({
                      message: error.message + "\t" + error.stack,
                      duration: 3000
                    });
            
            toastMessage.present();
    }));*/

  }
  
}