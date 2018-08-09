import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToastController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';

import { UserServices } from '../../services/UserServices';
import { MainPage } from '../main/main';
import { User } from '../../model/User';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  email: string;
  password: string;
  keepConnected: boolean = true;

  userProfile: any = null;

  constructor(public navCtrl: NavController, public auth: AngularFireAuth, 
              public toastCtrl: ToastController, private facebook: Facebook,
              public alertCtrl: AlertController, public db: AngularFireDatabase,
              public storage: Storage) {
  }

  ionViewDidLoad(){
    // Verifica se o e-mail e a senha estão no cache, caso sim, tenta o login
    this.storage.get('userEmail').then((userEmail) => {
      this.storage.get('userPass').then((userPass) => {
        if (userEmail != undefined && userEmail != null && userPass != undefined && userPass != null){
          console.log('Storage received');
          this.doLogin(userEmail, userPass);
        }
      });
    });
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

  doRegister(){
    // Função responsável por criar um usuário com base no e-mail e senha

    let email: string = '';
    let password1: string = '';
    let password2: string = '';
    let name: string = '';

    if (this.email != undefined     && this.email.length > 0)     email = this.email;
    if (this.password != undefined  && this.password.length > 0)  password1 = this.password;

    let alert = this.alertCtrl.create({
      title: 'Cadastro',
      subTitle: 'Informe os seus dados para o seu cadastro no aplicativo',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'name',
          placeholder: 'Nome',
          type: 'text'
        },{
          name: 'email',
          placeholder: 'E-mail',
          type: 'email',
          value: email
        },{
          name: 'password1',
          placeholder: 'Senha',
          type: 'password',
          value: password1
        },{
          name: 'password2',
          type: 'password',
          placeholder: 'Confirme sua senha'
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        }, {
          text: 'Ok',
          handler: data => {
            email = data.email;
            name = data.name;
            password1 = data.password1;
            password2 = data.password2;

            if (password1 != password2){
              // Exibe mensagem informando que as senhas não coincidem
              let toastMessage = this.toastCtrl.create({
                message: 'As senhas informadas não coincidem. Por favor, tente novamente.',
                duration: 3000
              });

              toastMessage.present();

              return false;

            }else{
              UserServices.register(this.auth, this.db, name, email, password1)
              .then((newUser: User) => { 
                // Tenta fazer o login do usuário recém cadastrado
                this.doLogin(newUser.getEmail(), password1);
              }).catch((errorMessage: string) => {
                // Exibe mensagem informando que houve um erro no momento do cadastro
                let toastMessage = this.toastCtrl.create({
                  message: errorMessage,
                  duration: 3000
                });

                toastMessage.present();
              });
            }

          }
        }
      ]
    });

    alert.present();
  }

  doLogin(email: string = this.email, password: string = this.password){
    // Função responsável por fazer o login do usuário com base no e-mail e senha
    if (email.length > 0 && password.length > 0){
      UserServices.login(this.auth, email, password)
      .then((userUID: string) => {
        // Caso o usuário queira manter conectado, salva as informações
        if (this.keepConnected){
          console.log('Storage setted');
          this.storage.set('userEmail', email);
          this.storage.set('userPass', password);
        }else{
          console.log('Storage removed');
          this.storage.remove('userEmail');
          this.storage.remove('userPass');
        }

        // Login efetuado com sucesso, vai para a próxima tela
        this.navCtrl.push(MainPage, {
          userUID: userUID
        });
      }).catch((errorMessage: string) => {
        // Exibe mensagem informando que houve um erro no momento de tentar o login
        let toastMessage = this.toastCtrl.create({
          message: errorMessage,
          duration: 3000
        });

        toastMessage.present();
      });
    }
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
          text: 'Cancelar'
        }, {
          text: 'Ok',
          handler: data => {
            email = data.email;

            // Envia o e-mail para redefinição de senha
            this.auth.auth.sendPasswordResetEmail(email).then((success => {
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