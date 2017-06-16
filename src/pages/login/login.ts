import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  email: string;
  password: string;

  constructor(public navCtrl: NavController, public firebaseAuthentication: AngularFireAuth, public toastCtrl: ToastController) {

  }

  createUser(){

    this.firebaseAuthentication.auth.createUserWithEmailAndPassword(this.email, this.password).then((success => {
      
    })).catch((error =>{
      
    }));

  }

  doLogin(){

    this.firebaseAuthentication.auth.signInWithEmailAndPassword(this.email, this.password).then((success => {
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
    }));

  }



}