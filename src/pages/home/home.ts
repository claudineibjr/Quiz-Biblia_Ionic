import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../model/User';
import { Question } from '../../model/Question';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  question: Question;

  constructor(public navCtrl: NavController, public db: AngularFireDatabase, public alertCtrl: AlertController) {
    this.question = new Question(null, null, null, null, null, null, null, null, null);
    
    this.getQuestion();
  }

  try(selectedAlternative: number){
    
    let alert = this.alertCtrl.create({
        title: 'Olá',
        subTitle: 'Alternativa ' + selectedAlternative,
        buttons: ['OK']
    });
    alert.present();

  }

  getQuestion(){

    let questionNumber: number;
    questionNumber = 1;

    let alternatives: Array<String>,
        idQuestion: number, strQuestion: string, answer: string, textBiblical: string, 
        levelQuestion: number, testamento: string, secaoBiblia: string, referenciaBiblica: string;

    //Busca a questão selecionada no banco de dados
    this.db.list('/question/' + questionNumber, { preserveSnapshot: true }).subscribe(snapshots => {
      snapshots.forEach(snapshot =>{

        switch(snapshot.key){
          case 'alternatives': {      alternatives = snapshot.val();  break;  }
          case 'answer': {            answer = snapshot.val();  break;  }
          case 'idQuestion': {        idQuestion = snapshot.val();  break;  }
          case 'levelQuestion': {     levelQuestion = snapshot.val();  break;  }
          case 'question': {          strQuestion = snapshot.val();  break;  }
          case 'referenciaBiblica': { referenciaBiblica = snapshot.val();  break;  }
          case 'secaoBiblia': {       secaoBiblia = snapshot.val();  break;  }
          case 'testamento': {        testamento = snapshot.val();  break;  }
          case 'textBiblical': {      textBiblical = snapshot.val();  break;  }
        }
      });

      //Instancia a nova questão
      this.question = new Question( idQuestion, strQuestion, parseInt(answer), alternatives, textBiblical, levelQuestion, 
                                    testamento, secaoBiblia, referenciaBiblica);

    });
  }

}