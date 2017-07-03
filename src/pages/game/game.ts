import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../model/User';
import { Question } from '../../model/Question';
import { Parameters } from '../../model/Parameters';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})

export class GamePage {

  question: Question;
  match: game.Match;
  time_Left_Question: number;

  constructor(public navCtrl: NavController, public db: AngularFireDatabase, public alertCtrl: AlertController) {
    // Seta a questão como nula, para que não dê erro, visto que é MVVM
    this.question = new Question(null, null, null, null, null, null, null, null, null);
    
    //Chama a função responsável por buscar a questão no banco de dados
    this.getQuestion();

    // Instancia uma nova partida
    this.match = new game.Match();

    this.time_Left_Question = Parameters.TIME_QUESTION;
  }

  try(selectedAlternative: number){ // Função acionada no fim da questão ou quando o usuário seleciona a opção
    
    //Variável responsável por identificar se o usuário acertou ou errou
    let correct: boolean;
    correct = selectedAlternative == this.question.getAnswer();
    
    // Variável local que exibirá a pontuação obtida com esta questão
    let scoreTry: number = 0;

    // Insere uma nova resposta na partida
    this.match.answers.push(new game.Answer(correct, this.question.getLevelQuestion()));

    this.playSound(correct);
    this.paintAlternative(correct, this.question.getAnswer(), selectedAlternative);

    if (correct){
      
      this.match.hit++;
      if (this.question.getLevelQuestion() == 3)
        this.match.hit_Hard++;

      // Soma pontuação por dificuldade
      switch (this.question.getLevelQuestion()){
          case 3: {
              scoreTry += Parameters.POINTS_HIT_HARD;
              break;
          }
          case 2: {
              scoreTry += Parameters.POINTS_HIT_MEDIUM;
              break;
          }
          case 1: {
              scoreTry += Parameters.POINTS_HIT_EASY;
              break;
          }
      }

      // Soma pontuação por tempo
      scoreTry += ( this.time_Left_Question >= 15 ? 
                                Parameters.POINTS_TIME_19_15 : 
                                (this.time_Left_Question <= 14 && this.time_Left_Question >= 10 ? 
                                  Parameters.POINTS_TIME_14_10 : 
                                  (this.time_Left_Question <= 9 && this.time_Left_Question >= 5 ? 
                                    Parameters.POINTS_TIME_9_5 : 
                                    (this.time_Left_Question <= 4 ? 
                                      Parameters.POINTS_TIME_4_0 : 
                                      0)
                                    )
                                  )
                            );

    }else{
      
      this.match.hit = 0;
      if (this.question.getLevelQuestion() == 3)
          this.match.hit_Hard = 0;

      // Decrementa pontuação por erro
      scoreTry += Parameters.POINTS_WRONG;

      // Decrementa pontuação por dificuldade
      switch (this.question.getLevelQuestion()){
          case 3: {
              scoreTry += Parameters.POINTS_WRONG_HARD;
              break;
          }
          case 2: {
              scoreTry += Parameters.POINTS_WRONG_MEDIUM;
              break;
          }
          case 1: {
              scoreTry += Parameters.POINTS_WRONG_EASY;
              break;
          }
      }      
    }

    this.showAnswer(correct, this.question.getTextBiblical(), 0);

    // Soma a pontuação obtida nesta tentativa à pontuação da partida
    this.match.score += scoreTry;

    this.verifySequenceQuestions();        

  }

  showAnswer(correct: boolean, textBiblical: string, points: number){
    
    // Exibe uma mensagem com a pontuação, o resultado da questão e texto bíblico
    let alert = this.alertCtrl.create({
      title: (correct ? 'Parabéns, você acertou!' : 'Que pena, você errou!'),
      subTitle: points + " pontos.",
      message: textBiblical,
      cssClass: (correct ? 'correct-answer' : 'wrong-answer'),
      buttons: ['Ok']
    });
    alert.present();

  }

  playSound(correct: boolean){

    //

  }
  
  paintAlternative(correct: boolean, answer: number, selectedAlternative: number){

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

      // Enquanto não tiver sorteado aleatório, realiza um novo sorteio
      while (!randomOk){
        
        // Gera o número aleatório entre 0 e 3
        let randomizedNumber: number = Math.floor(Math.random() * 4);

        // Verifica se a lista está vazia, caso esteja, insere, caso não esteja, verifica se o número sorteado está na lista
        if (randomizedList.length > 0){

          //Verifica se o número que foi sorteado já não havia sido inserido na lista
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

    // Verifica para qual alternativa na ordem ficou a resposta correta
    for (let iCount: number = 0; iCount <= 3; iCount++){
      if (transitions_To[iCount] == alternatives_and_answer[0]){
        alternatives_and_answer[0] = iCount;
        break;
      }
    }

    // Utiliza um array auxiliar para alterar as alternativas
    let alternatives_aux: Array<string> = [];
    for (let iCount: number = 0; iCount <= 3; iCount++){
      alternatives_aux[iCount] = alternatives_and_answer[1][randomizedList[iCount]];
    }
    alternatives_and_answer[1] = alternatives_aux;

    return alternatives_and_answer;
  }

  existOnList(list: Array<Object>, object: Object): boolean{

    // Verifica se o objeto passado como parâmetro existe na lista
    for (let i: number = 0; i < list.length; i++){
      if (list[i] == object)
        return true;
    }

    return false;
  }

  verifySequenceQuestions(): void{
    // 10 questões seguidas (1 aleatório)
    // 5 difíceis seguidas (1 aleatório)

    if (this.match.hit >= Parameters.HITS_POWERUP) {
        this.winPowerUP();
        this.match.hit = 0;
    }
    if (this.match.hit_Hard >= Parameters.HITS_HARD_POWERUP){
        this.winPowerUP();
        this.match.hit_Hard = 0;
    }    
  }

  winPowerUP(){
    /*
        Random random = new Random();

        int powerUPSorteado = random.nextInt(3);

        String mensagem = "Parabéns, você ganhou 1 PowerUP de ";

        switch (powerUPSorteado) {
            case 0: {
                mensagem += "tempo.";
                usuario.getBonus().setBonusTempo(1);
                break;
            }

            case 1: {
                mensagem += "eliminação de alternativa incorreta.";
                usuario.getBonus().setBonusAlternativa(1);
                break;
            }

            case 2: {
                mensagem += "exibição da referência bíblia.";
                usuario.getBonus().setBonusReferenciaBiblica(1);
                break;
            }
        }

        Snackbar.make(findViewById(R.id.activity_jogo), mensagem, Snackbar.LENGTH_LONG).show();

        FirebaseDB.getUsuarioReferencia().child(usuario.getUid()).setValue(usuario);    
    */
  }

}

module game{

  export class Match {
    public score: number;
    public time_left: number = 120;
    public answers: Array<Answer> = [];
    public hit: number;
    public hit_Hard: number;  
  }

  export class Answer{
    private hit: boolean;
    private dificulty: number; //1 - Fácil     | 2 - Média | 3 - Difícil

    constructor(hit: boolean, dificulty: number) {
        this.hit = hit;
        this.dificulty = dificulty;
    }

    public isHit(): boolean {
        return this.hit;
    }

    public getDificulty(): number {
        return this.dificulty;
    }

    public toString(): string {
        return "Resposta{" +
                "acerto=" + this.hit +
                ", dificuldade=" + this.dificulty +
                '}';
    }
  }

}