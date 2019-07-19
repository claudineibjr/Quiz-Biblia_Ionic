import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { User } from '../../model/User';
import { UserServices } from '../../services/UserServices';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {
  user_Email: string;
  user_Name: string;
  user_Score: number;
  user_AnsweredNumber: number;
  
  user_Preferences_Sound: boolean;
  user_Preferences_Vibration: boolean;

  user_Bonus_Alternative: number;
  user_Bonus_BiblicalReference: number;
  user_Bonus_Time: number;
  user_Bonus_LastReceived: Date;

  constructor(public navCtrl: NavController, public database: AngularFireDatabase,
              public alertCtrl: AlertController, public auth: AngularFireAuth,
              public toastCtrl: ToastController) {
    this.setUserFields();
  }

  setUserFields(): void{
    this.user_Email = UserServices.getUser().getEmail();
    this.user_Name = UserServices.getUser().getName();
    this.user_Score = UserServices.getUser().getScore();
    this.user_AnsweredNumber = UserServices.getUser().getAnswered().length;

    this.user_Preferences_Sound = UserServices.getUser().getPreferences().getSound();
    this.user_Preferences_Vibration = UserServices.getUser().getPreferences().getVibration();

    this.user_Bonus_Alternative = UserServices.getUser().getBonus().getAlternative();
    this.user_Bonus_BiblicalReference = UserServices.getUser().getBonus().getBiblicalReference();
    this.user_Bonus_Time = UserServices.getUser().getBonus().getTime();
    this.user_Bonus_LastReceived = UserServices.getUser().getBonus().getLastBonusReceived();
  }

  cancel(): void{
    this.user_Name = UserServices.getUser().getName();
    this.user_Preferences_Sound = UserServices.getUser().getPreferences().getSound();
    this.user_Preferences_Vibration = UserServices.getUser().getPreferences().getVibration();
  }

  save(): void{
    UserServices.getUser().setName(this.user_Name);
    UserServices.getUser().getPreferences().setSound(this.user_Preferences_Sound);
    UserServices.getUser().getPreferences().setVibration(this.user_Preferences_Vibration);

    UserServices.updateUserInDb(this.database, UserServices.getUser());
  }

  deleteAccount(): void{

  }

  resetAccount(): void{
    // Exibe a mensagem pedindo a senha
    let alert = this.alertCtrl.create({
      title: 'Reiniciar conta',
      subTitle: 'Informe sua senha para confirmar o reinício de sua conta.',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'password',
          placeholder: 'Confirme sua senha',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        }, {
          text: 'Ok',
          handler: data => {
            let password = data.password;

            // Verifica se tem como fazer o login para verificar se a senha está correda
            UserServices.login(this.auth, UserServices.getUser().getEmail(), password).then((uid) => {
              
              // Cria um novo usuário
              let user: User = new User(UserServices.getUser().getUid());
              user.setName(UserServices.getUser().getName());
              user.setEmail(UserServices.getUser().getEmail());
          
              UserServices.setUser(user);
              UserServices.updateUserInDb(this.database, UserServices.getUser());

              this.setUserFields();

              // Exibe mensagem informando que a conta foi reiniciada
              let toastMessage = this.toastCtrl.create({
                message: 'Conta reiniciar com sucesso!',
                duration: 3000
              });

              toastMessage.present();              

            }).catch((error) => {
              // Exibe mensagem informando que a senha está incorreta
              let toastMessage = this.toastCtrl.create({
                message: 'Senha incorreta! Não foi possível reiniciar sua conta.',
                duration: 3000
              });
            });

          }
        }
      ]
    });

    alert.present();
  }

}