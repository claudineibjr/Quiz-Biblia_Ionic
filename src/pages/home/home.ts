import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { User } from '../../model/User';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, db: AngularFireDatabase) {
    this.users = db.list('/usuario');
    console.log("Carregou\n\n" + this.users + "\n");
  }

}