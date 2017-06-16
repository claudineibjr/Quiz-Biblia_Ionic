import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../model/User';
import { Question } from '../../model/Question';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  questions: Array<Question> = [];

  constructor(public navCtrl: NavController, db: AngularFireDatabase) {
    let questions = db.list('/question');

    questions.forEach(elements =>{
      elements.forEach(element => {
        console.log(element);
        this.questions.push(element);
      })
    });
    
  }

}