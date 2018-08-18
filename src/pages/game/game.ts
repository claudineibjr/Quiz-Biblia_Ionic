import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { ToastController } from 'ionic-angular';

import { Question } from '../../model/Question';
import { Parameters } from '../../model/Parameters';
import { UserServices } from '../../services/UserServices';
import { User } from '../../model/User';
import { QuestionServices } from '../../services/QuestionServices';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})

export class GamePage {

  question: Question;
  match: game.Match;
  time_Left_Question: number;
  run_stopWatch: boolean;
  alternatives_disabled: number;
  alternatives_enabled: Array<boolean> = [false, false, false, false];
  alternatives_images: Array<String> = [];
  
  bonus_Alternative: number;
  bonus_BiblicalReference: number;
  bonus_Time: number;

  image: Array<String> = [];

  constructor(  public navCtrl: NavController, public database: AngularFireDatabase,
                public alertCtrl: AlertController, public nativeAudio: NativeAudio,
                public toastCtrl: ToastController, public navParams: NavParams) {
    
    //Cria as alternativas em branco para que apareça o espaço em branco
    let auxAlternatives: Array<String> = [];
    auxAlternatives.push("");
    auxAlternatives.push("");
    auxAlternatives.push("");
    auxAlternatives.push("");
    
    // Seta a questão como nula, para que não dê erro, visto que é MVVM
    this.question = new Question(null, null, null, auxAlternatives, null, null, null, null, null);
    
    //Chama a função responsável por buscar a questão no banco de dados
    this.getQuestion();

    // Instancia uma nova partida
    this.match = new game.Match();

    //Prepara o áudio para acertos
    this.nativeAudio.preloadSimple('correctAudio', 'assets/sound/sound_correct_answer.mp3').then(mensagem => {
      console.log('Sucesso ao carregar o áudio (correctAudio) | ' + mensagem);
      }, erro => {
        console.log('Falha ao carregar o áudio (correctAudio) | ' + erro);
      });
    
    //Prepara o áudio para erros
    this.nativeAudio.preloadSimple('wrongAudio', 'assets/sound/sound_wrong_answer.mp3').then(mensagem => {
        console.log('Sucesso ao carregar o áudio(wrongAudio) | ' + mensagem);
      }, erro => {
        console.log('Falha ao carregar o áudio (wrongAudio) | ' + erro);
      });    

    // Prepara o áudio do tick tack para os últimos 5 segundos
    this.nativeAudio.preloadSimple('tick_tack_last5Seconds', 'assets/sound/sound_tick_tack_last5seconds.mp3').then(mensagem => {
      console.log('Sucesso ao carregar o áudio(TickTack) | ' + mensagem);
    }, erro => {
      console.log('Falha ao carregar o áudio (TickTack) | ' + erro);
    });

    // Seta o frame das imagens das alternativas
    this.setImageInAllAlternatives(true);

    // Inicia o cronômetro
    this.run_stopWatch = true;
    this.startTimer();

    // Define os bônus do usuário
    this.bonus_Alternative = UserServices.getUser().getBonus().getAlternative();
    this.bonus_BiblicalReference = UserServices.getUser().getBonus().getBiblicalReference();
    this.bonus_Time = UserServices.getUser().getBonus().getTime();
  }

  ionViewWillLeave(){
    // Pára o cronômetro
    this.run_stopWatch = false;

    // Grava as alterações no usuário
    // Salva os bônus
    let newUserBonus: User.Bonus = UserServices.getUser().getBonus();
    newUserBonus.setAlternative(this.bonus_Alternative);
    newUserBonus.setBiblicalReference(this.bonus_BiblicalReference);
    newUserBonus.setTime(this.bonus_Time);
    UserServices.getUser().setBonus(newUserBonus);

    // Salva a pontuação e a data do último jogo
    UserServices.getUser().addScore(this.match.score);
    UserServices.getUser().setLastGame(new Date(Date.now()));

    // Salva as alterações no banco de dados
    UserServices.updateUserInDb(this.database, UserServices.getUser());

    // Pára a reprodução do áudio caso esteja rodando
    this.nativeAudio.stop('tick_tack_last5Seconds');
  }

  getStopWatchImage(): string{
    if (this.time_Left_Question > 20)
      return 'assets/img/stopwatch/0-20.png';
    else
      return 'assets/img/stopwatch/' + (20 - this.time_Left_Question).toString() + '-20.png';
  }

  startTimer(): void{
    // Função responsável por passar o tempo restante para responder a questão
    setTimeout(() => {
      // Só decrementa caso o contador esteja rodando
      if (this.run_stopWatch){
        this.time_Left_Question -= 1;

        // Faltando 5 segundos começa o som do tick tack
        if (this.time_Left_Question == 5)
          this.nativeAudio.play('tick_tack_last5Seconds', () => console.log("Rodou"));

        // Acabou o tempo, o usuário não conseguiu responder a questão
        if (this.time_Left_Question == 0){
          this.try(-1);
        }
      }

      // Decrementa o contador e continua contando
      this.startTimer();
    }, 1000);

  }

  try(selectedAlternative: number): void{
    // Função acionada no fim da questão ou quando o usuário seleciona a opção   

    // Pára o cronômetro
    this.run_stopWatch = false;

    // Seta todas as alternativas como invisíveis
    this.setVisibilityInAllAlternatives(false);

    // Pára a reprodução do áudio caso esteja rodando
    this.nativeAudio.stop('tick_tack_last5Seconds');

    //Variável responsável por identificar se o usuário acertou ou errou
    let correct: boolean;
    correct = selectedAlternative == this.question.getAnswer();
    
    // Variável local que exibirá a pontuação obtida com esta questão
    let scoreTry: number = 0;

    // Insere uma nova resposta na partida
    this.match.answers.push(new game.Answer(correct, this.question.getLevelQuestion()));

    // Reproduz som
    this.playSound(correct);

    // Pinta a alternativa de acordo com a resposta correta ou não
    this.paintAlternative(correct, this.question.getAnswer(), selectedAlternative);

    if (correct){
      
      // Soma a variável de acertos seguidos da partida
      this.match.hit++;
      
      // Caso a questão for difícil, soma a variável de acertos difíceis seguidos
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
      scoreTry += (this.time_Left_Question >= 15 ? 
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


      // Adiciona a questão na lista de questões respondidas
      UserServices.getUser().addAnswered(this.question.getId());

    }else{
      
      // Zera a variável de acertos seguidos da partida
      this.match.hit = 0;

      // Zera a variável de acertos difíceis seguidos da partida 
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

    // Exibe a resposta na tela
    this.showAnswer(correct, this.question.getTextBiblical(), scoreTry);

    // Soma a pontuação obtida nesta tentativa à pontuação da partida
    this.match.score += scoreTry;

    // Verifica a sequência de acertos e dá os bônus caso necessário
    this.verifySequenceQuestions();

  }

  showAnswer(correct: boolean, textBiblical: string, points: number): void{
    // Exibe uma mensagem com a pontuação, o resultado da questão e texto bíblico

    let alert = this.alertCtrl.create({
      title: (correct ? 'Parabéns, você acertou!' : 'Que pena, você errou!'),
      subTitle: points + " pontos.",
      message: '<font color="black">' + textBiblical + '</font>',
      enableBackdropDismiss: false,
      cssClass: (correct ? 'correct-answer' : 'wrong-answer'),
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // Carrega a próxima questão
            this.getQuestion();
          }
        }
      ]
    });

    alert.present();

  }

  playSound(correct: boolean): void{
    // Reproduz som
    if (correct){      
      this.nativeAudio.play('correctAudio', () => console.log("Rodou"));
    }else{
      this.nativeAudio.play('wrongAudio', () => console.log("Rodou"));
    }
  }

  setVisibilityInAllAlternatives(visibility: boolean): void{
    setTimeout(() => {
      let iCount: number = 0;
      while (this.alternatives_enabled[iCount] == visibility && iCount <= 3)
        iCount += 1;

      if (iCount <= 3){
        this.alternatives_enabled[iCount] = visibility;
        this.setVisibilityInAllAlternatives(visibility);
      }else if (visibility)
        this.run_stopWatch = true;

    }, 100);
  }

  setImageInAllAlternatives(resetDefault: boolean, urlImage: String = ''): void{
    if (resetDefault)
      urlImage = 'assets/img/quadro_alternativa.png';

    if (this.alternatives_images.length != 4){
      this.alternatives_images = [urlImage,urlImage,urlImage,urlImage];
    }else{
      this.alternatives_images[0] = urlImage;
      this.alternatives_images[1] = urlImage;
      this.alternatives_images[2] = urlImage;
      this.alternatives_images[3] = urlImage;
    }
  }

  setImageinAlternative(indexAlternative: number, urlImage: String): void{
    this.alternatives_images[indexAlternative] = urlImage;
  }

  paintAlternative(correct: boolean, answer: number, selectedAlternative: number): void{
    // Pinta a alternativa de acordo com a resposta correta ou não

    if (selectedAlternative == -1){
      // Se for -1 significa que o tempo acabou, pinta todas de vermelho
      this.setImageInAllAlternatives(false, 'assets/img/quadro_alternativa_incorreta.png');
    }else{     
      if (correct)
        this.setImageinAlternative(selectedAlternative, 'assets/img/quadro_alternativa_correta.png');
      else
      this.setImageinAlternative(selectedAlternative, 'assets/img/quadro_alternativa_incorreta.png');
    }
  }

  getQuestion(): void{
    //Função acionada ao buscar uma questão aleatória

    // Carrega novamente o tempo restante para responder à questão
    this.time_Left_Question = Parameters.TIME_QUESTION;

    // Inicia a variável responsável por controlar o número de alternativas que foram desabilitadas
    this.alternatives_disabled = 0;

    QuestionServices.getQuestion(this.database, this.navParams.get('parametersToFindQuestion')).then(question => {
      this.question = question;

      // Reseta a imagem utilizada na alternativa
      this.setImageInAllAlternatives(true);

      // Reseta as alternativas visíveis
      this.setVisibilityInAllAlternatives(true);

    });
  }

  verifySequenceQuestions(): void{
    // 5 questões seguidas (1 aleatório)
    // 3 difíceis seguidas (1 aleatório)

    if (this.match.hit >= Parameters.HITS_POWERUP) {
        this.winPowerUP();
        this.match.hit = 0;
    }
    if (this.match.hit_Hard >= Parameters.HITS_HARD_POWERUP){
        this.winPowerUP();
        this.match.hit_Hard = 0;
    }    
  }

  help_BiblicalReference(): void{
    if (this.bonus_BiblicalReference > 0){
      let alert = this.alertCtrl.create({
        title: ('Referência bíblica'),
        subTitle: this.question.getReferenciaBiblica()
      });

      alert.present();

      // Decrementa o bônus
      this.bonus_BiblicalReference -= 1;
    }
  }

  help_DeleteIncorretAnswer(): void{
    if (this.bonus_Alternative > 0){
      if (this.alternatives_disabled < 3) {
        //Gera um número aleatório entre 0 e 3, que será a alternativa a ser eliminada
        let deleted_Alternative: number = Math.floor(Math.random() * 4);

        // Enquanto a alternativa aleatória for a correta ou já estiver desabilitada, gera uma nova alternativa aleatória
        while (deleted_Alternative == this.question.getAnswer() || this.alternatives_enabled[deleted_Alternative] == false){
          deleted_Alternative = Math.floor(Math.random() * 4);
        }

        // Elimina a alternativa gerada aleatóriamente
        this.alternatives_enabled[deleted_Alternative] = false;

        // Incrementa o contador de alternativas eliminadas
        this.alternatives_disabled++;

        // Decrementa o bônus
        this.bonus_Alternative -= 1;
      }
    }
  }

  help_More5Seconds(): void{
    if (this.bonus_Time > 0){
      if (this.run_stopWatch)
        this.time_Left_Question += Parameters.PLUS_TIME;

      // Decrementa o bônus
      this.bonus_Time -= 1; 
    }
  }

  winPowerUP(): void{
    // Função responsável por sortear PowerUP para o usuário
    
    // Sorteia o PowerUP
    let aleatoryPowerUP: number = Math.floor(Math.random() * 3);

    // Criação da mensagem avisando o usuário do PowerUP
    let message: string = 'Parabéns, você ganhou um PowerUP de ';

    // Verifica o PowerUP ganho
    switch(aleatoryPowerUP){
      case 0:{
        message += 'referência bíblica.';
        this.bonus_BiblicalReference += Parameters.POWER_UP_GAME;
        break;
      }
      case 1:{
        message += 'eliminação de alternativa incorreta.';
        this.bonus_Alternative += Parameters.POWER_UP_GAME;
        break;
      }
      case 2:{
        message += 'tempo.';
        this.bonus_Time += Parameters.POWER_UP_GAME;
        break;
      }
    }

    // Exibição da mensagem
    let toastMessage = this.toastCtrl.create({
      message: message,
      duration: 3000
    });

    toastMessage.present();

  }

}

module game{

  export class Match {
    public score: number = 0;
    public time_left: number = 120;
    public answers: Array<Answer> = [];
    public hit: number = 0;
    public hit_Hard: number = 0;  
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