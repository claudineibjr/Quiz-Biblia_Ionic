import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MainPage } from '../main/main';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  email: string;
  password: string;

  userProfile: any = null;

  constructor(public navCtrl: NavController, public firebaseAuthentication: AngularFireAuth, 
              public toastCtrl: ToastController, private facebook: Facebook,
              public alertCtrl: AlertController) {
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
    // Função responsável por criar um usuário usuário com base no e-mail e senha

    this.firebaseAuthentication.auth.createUserWithEmailAndPassword(
     this.email, this.password).then((success => {
      
    })).catch((error =>{
      
    }));

  }

  doLogin(){
    // Função responsável por fazer o login do usuário com base no e-mail e senha

    this.firebaseAuthentication.auth.signInWithEmailAndPassword(
     this.email, this.password).then((success => {
      
      // Exibe mensagem informando que o login foi efetuado com sucesso
      let toastMessage = this.toastCtrl.create({
                message: success.message,
                duration: 3000
              });
      toastMessage.present();

      // Abre a próxima tela
      this.navCtrl.push(MainPage, {
        userUID: success.uid
      });

    })).catch((error => {

      // Exibe mensagem informando que houve um erro no momento de tentar o login
      let toastMessage = this.toastCtrl.create({
                      message: error.message + "\t" + error.stack,
                      duration: 3000
                    });
      toastMessage.present();
    }));

  }

  forgotPassword(){
    // Função responsável por enviar um e-mail de redefinição de senha para o endereço informado

    let email: string = '';

    // Cria um alerta na tela pedindo o e-mail para enviar o link para resetar a senha
    let alert = this.alertCtrl.create({
      title: 'Informe o e-mail para redefinir a senha',
      subTitle: 'O endereço e-mail informado nesta tela receberá um link para redefinir a senha.',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'email',
          placeholder: 'E-mail',
          value: this.email
        }
      ],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            email = data.email;

            // Envia o e-mail para redefinição de senha
            this.firebaseAuthentication.auth.sendPasswordResetEmail(email).then((success => {
              let toastMessage = this.toastCtrl.create({
                message: 'E-mail para redefinição de senha enviado com sucesso.',
                duration: 3000
              });
        
              toastMessage.present();
            })).catch((error => {
              let toastMessage = this.toastCtrl.create({
                message: 'Falha ao enviar o e-mail para redefinição de senha',
                duration: 3000
              });
        
              toastMessage.present();
            }));

          }
        }
      ]
    });

    alert.present();
  }
}