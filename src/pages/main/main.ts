import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

import { AboutPage } from '../about/about';
import { ProfilePage } from '../profile/profile';
import { GameParametersPage } from '../gameparameters/gameparameters';
import { HelpPage } from '../help/help';

import { User } from '../../model/User';

import { UserServices } from '../../services/UserServices';

@Component({
  templateUrl: 'main.html'
})
export class MainPage {

  tab1Root = GameParametersPage;
  tab2Root = AboutPage;
  tab3Root = ProfilePage;
  tab4Root = HelpPage;
  
  constructor(public navParams: NavParams, public db: AngularFireDatabase) {
    UserServices.getDbUser(db, navParams.get('userUID'));
  }
}