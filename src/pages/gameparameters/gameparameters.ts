import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GamePage } from '../game/game';

import { App, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-gameparameters',
  templateUrl: 'gameparameters.html'
})
export class GameParametersPage {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public appCtrl: App) {
  }

  play(){
    //this.navCtrl.push(GamePage);

    //this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(GamePage);

  }

}