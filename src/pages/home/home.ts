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
    // Seta a questão como nula, para que não dê erro, visto que é MVVM
    this.question = new Question(null, null, null, null, null, null, null, null, null);
    
    //Chama a função responsável por buscar a questão no banco de dados
    this.getQuestion();
  }

  try(selectedAlternative: number){
    
    //Variável responsável por identificar se o usuário acertou ou errou
    let correct: boolean;
    correct = selectedAlternative == this.question.getAnswer();
    
    let alert = this.alertCtrl.create({
      subTitle: 'Acertou: ' + correct,
      title: 'olá',
      buttons: ['Ok']
    });
    alert.present();

  }

  getQuestion(){

    let questionNumber: number;
    questionNumber = this.aleatoryNumberQuestion();

    //Cria as variáveis locais apenas para armazenar temporariamente os dados antes de criar a questão
    let alternatives: Array<String>,
        idQuestion: number, strQuestion: string, answer: string, textBiblical: string, 
        levelQuestion: number, testamento: string, secaoBiblia: string, referenciaBiblica: string;

    //Busca a questão selecionada no banco de dados
    this.db.list('/question/' + questionNumber, { preserveSnapshot: true }).subscribe(snapshots => {
      snapshots.forEach(snapshot =>{

        switch(snapshot.key){
          case 'alternatives': {      alternatives = snapshot.val();      break;  }
          case 'answer': {            answer = snapshot.val();            break;  }
          case 'idQuestion': {        idQuestion = snapshot.val();        break;  }
          case 'levelQuestion': {     levelQuestion = snapshot.val();     break;  }
          case 'question': {          strQuestion = snapshot.val();       break;  }
          case 'referenciaBiblica': { referenciaBiblica = snapshot.val(); break;  }
          case 'secaoBiblia': {       secaoBiblia = snapshot.val();       break;  }
          case 'testamento': {        testamento = snapshot.val();        break;  }
          case 'textBiblical': {      textBiblical = snapshot.val();      break;  }
        }
      });

      // Chamada de função que troca a ordem das questões e também altera o índice da resposta correta para identificá-la posteriormente
      let alternatives_and_answer: Array<Object> = [];
      alternatives_and_answer.push(answer);
      alternatives_and_answer.push(alternatives);
      alternatives_and_answer = this.randomizeAlternatives(alternatives_and_answer);

      //Instancia a nova questão
      this.question = new Question( idQuestion, strQuestion, parseInt(<string> alternatives_and_answer[0]), 
                                    <Array<string>> alternatives_and_answer[1], textBiblical, levelQuestion, 
                                    testamento, secaoBiblia, referenciaBiblica);

    });
  }

  aleatoryNumberQuestion(): number{
    return 1;
  }

  randomizeAlternatives(alternatives_and_answer: Array<Object>): Array<Object>{

    let randomizedList: Array<number> = [];
    let transitions_To: Array<Number> = [];

    for (let iCount: number = 0; iCount <=3; iCount++){

      let randomOk: boolean = false;

      while (!randomOk){
        let randomizedNumber: number = Math.floor(Math.random() * 4);

        if (randomizedList.length > 0){
          if (!this.existOnList(randomizedList, randomizedNumber)){
            // Insere o número aleatório na lista
            transitions_To.push(randomizedNumber);
            randomizedList.push(randomizedNumber);
            randomOk = true;
            
          }
        }else{
          // Insere o número aleatório na lista
          transitions_To.push(randomizedNumber);
          randomizedList.push(randomizedNumber);
          randomOk = true;
        }
      }
    }

    for (let iCount: number = 0; iCount <= 3; iCount++){
      if (transitions_To[iCount] == alternatives_and_answer[0]){
        alternatives_and_answer[0] = iCount;
        break;
      }
    }
    
    return alternatives_and_answer;
  }

  existOnList(list: Array<Object>, object: Object): boolean{

    for (let i: number = 0; i < list.length; i++){
      if (list[i] == object)
        return true;
    }

    return false;
  }

}