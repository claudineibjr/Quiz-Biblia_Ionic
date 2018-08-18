import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { GamePage } from '../game/game';

import { App, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-gameparameters',
  templateUrl: 'gameparameters.html'
})
export class GameParametersPage {

  parametersToFindQuestion: Array<string>;
  questionSection: string = '0';
  questionDificulty: string = '0';

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, 
              public alertCtrl: AlertController, public appCtrl: App) {
    this.parametersToFindQuestion = [];
  }

  play(){

    this.parametersToFindQuestion = [];

    if (this.questionDificulty != '0'){
      this.parametersToFindQuestion.push('dificulty');
      this.parametersToFindQuestion.push(this.questionDificulty);
    }

    if (this.questionSection != '0'){
      this.parametersToFindQuestion.push('section');
      this.parametersToFindQuestion.push(this.questionSection);
    }

    console.log('this.parametersToFindQuestion');
    console.log(this.parametersToFindQuestion);

    this.appCtrl.getRootNav().push(GamePage, {
      parametersToFindQuestion: this.parametersToFindQuestion
    });
  }

}