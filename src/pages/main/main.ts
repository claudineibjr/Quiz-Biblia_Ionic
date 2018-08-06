import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

import { AboutPage } from '../about/about';
import { ProfilePage } from '../profile/profile';
import { GameParametersPage } from '../gameparameters/gameparameters';
import { HelpPage } from '../help/help';

import { User } from '../../model/User';

import { UsuarioService } from '../../services/usuarioServices';

@Component({
  templateUrl: 'main.html'
})
export class MainPage {

  tab1Root = GameParametersPage;
  tab2Root = AboutPage;
  tab3Root = ProfilePage;
  tab4Root = HelpPage;
  
  constructor(public navParams: NavParams, public db: AngularFireDatabase) {
    UsuarioService.getDbUser(db, navParams.get('userUID'));
    UsuarioService.getUser().getBonus().getBiblicalReference();
    UsuarioService.getUser().getBonus().getTime();
  }

}