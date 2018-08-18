import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { AboutPage } from '../about/about';
import { ProfilePage } from '../profile/profile';
import { GameParametersPage } from '../gameparameters/gameparameters';
import { HelpPage } from '../help/help';

import { User } from '../../model/User';

import { UserServices } from '../../services/UserServices';
import { Parameters } from '../../model/Parameters';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  tab1Root = GameParametersPage;
  tab2Root = ProfilePage;
  tab3Root = HelpPage;
  
  constructor(public navParams: NavParams, public database: AngularFireDatabase,
              public alertCtrl: AlertController, public auth: AngularFireAuth,
              public navCtrl: NavController, public storage: Storage) {

  }

  ionViewDidEnter(){
    if (UserServices.getUser() == null){
      UserServices.getDbUser(this.database, this.navParams.get('userUID')).then((user) => {
        this.verifyBonus();
      });
    }else{
      this.verifyBonus();
    }

    let oi: number = 1;
    if (oi == 1){
      this.database.list('/question/').subscribe(questions =>{
        questions.forEach(question => {
          this.database.object('/question_filter/dificulty/' + question.levelQuestion).$ref.push(question.idQuestion);
          this.database.object('/question_filter/section/' + question.secaoBiblia).$ref.push(question.idQuestion);
          this.database.object('/question_filter/dificulty_section/' + question.levelQuestion + '_' + question.secaoBiblia).$ref.push(question.idQuestion);
        });
      });
    }

  }

  verifyBonus(){
    // Verifica se passou um dia desde o último jogo
    let aDayInSeconds = new Date(Date.now()).getTime() - UserServices.getUser().getBonus().getLastBonusReceived().getTime();

    // Se já se passou um dia desde o acesso, sorteia alguns PowerUPs
    if (aDayInSeconds > Parameters.DIA_EM_MILISEGUNDO){

      let bonus_BiblicalReference: number = 0, bonus_Alternative: number = 0, bonus_Time: number = 0;

      for (let iCount: number = 0; iCount < Parameters.POWER_UP_DIARY; iCount++){
        // Sorteia o PowerUP
        let aleatoryPowerUP: number = Math.floor(Math.random() * 3);

        // Verifica o PowerUP ganho
        switch(aleatoryPowerUP){
          case 0:{  bonus_BiblicalReference += 1; break;  }
          case 1:{  bonus_Alternative += 1;       break;  }
          case 2:{  bonus_Time += 1;              break;  }
        }
      }

      // Salva no usuário e no BD
      UserServices.getUser().getBonus().addBiblicalReference(bonus_BiblicalReference);
      UserServices.getUser().getBonus().addAlternative(bonus_Alternative);
      UserServices.getUser().getBonus().addTime(bonus_Time);
      UserServices.getUser().getBonus().setLastBonusReceived(new Date(Date.now()));

      // Exibe a mensagem
      let alert = this.alertCtrl.create({
        title:  '<img class="giftImage" src = "assets/img/gift.png">' +
                '<font color="#2d6bb8"><b>Parabéns</b></font>, você ganhou seu bônus diário!',
        subTitle: 'Aqui estão alguns PowerUPs para você mandar bem no <b>Quiz Bíblico</b>.',
        message:  '<font color="black">' +
                    (bonus_BiblicalReference > 0 ? '<img class="bonusGiftImage" src = "assets/img/biblical_reference.png"> <b>' + bonus_BiblicalReference + '</b> Bônus para visualizar a referência bíblica<br/>' : '') +
                    (bonus_Alternative > 0 ? '<img class="bonusGiftImage" src = "assets/img/help-icon.png"> <b>' + bonus_Alternative + '</b> Bônus para eliminar uma alternativa incorreta<br/>' : '') +
                    (bonus_Time > 0 ? '<img class="bonusGiftImage" src = "assets/img/+5_seconds.png"> <b>' + bonus_Time + '</b> Bônus para acrescentar +5 segundos para responder à questão<br/>' : '') +
                  '</font>'
      });

      alert.present();
    }
  }

  logoff(){
    this.auth.auth.signOut().then((logoff) => {
      console.log('Storage removed');
      this.storage.remove('userEmail');
      this.storage.remove('userPass');

      this.navCtrl.pop();
    });
  }
}