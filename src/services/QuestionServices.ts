//import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';

import 'rxjs/add/operator/take';

import { Question } from "../model/Question";

import { UserServices } from './UserServices';

/*enum enumSections{
    pentateuco = 'Pentateuco',
    historia_1 = 'História (A.T)',
    poesia = 'Poesia',
    profetas_maiores = 'Profetas Maiores',
    profetas_menores = 'Profetas Menores',
    evangelhos = 'Evangelhos',
    historia_2 = 'História (N.T)',
    cartas = 'Cartas',
    profecia = 'Profecia'
}

enum enumDificulty_Number{
    Facil,
    Medio,
    Dificil
}

enum enumDificulty_String{
    Facil = 'Fácil',
    Medio = 'Médio',
    Dificil = 'Difícil'
}*/

export class QuestionServices{

    // Singleton implementation
    private static _instance: QuestionServices;
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }

    /*public static enumSections = enumSections;
    public static enumDificulty_Number = enumDificulty_Number;
    public static enumDificulty_String = enumDificulty_String;*/

    public static getQuestion(database: AngularFireDatabase, parameters: Array<string>): Promise<Question>{
        return new Promise<Question> ((resolve, reject) => {
            let rootSearch: string = '';

            // Verifica os parâmetros passados e então monta a query com base neles
            // (    Podendo buscar aleatoriamente, 
            //      aleatoriamente pelo nível,
            //      aleatoriamente pela seção, 
            //      aleatoriamente pelo nível e pela seção)
            if (parameters.length == 2){
                rootSearch = parameters[0]; //dificulty | section
                rootSearch += '/' + parameters[1]; // Nível de dificuldade a ser buscado ou Seção a ser buscada
            }else if (parameters.length == 4){
                rootSearch = parameters[0] + '_' + parameters[2]; //dificulty_section
                rootSearch += '/' + parameters[1] + '_' + parameters[3]; // Nível de dificuldade a ser buscado_Seção a ser buscada
            }

            if (parameters.length > 0){
                // Busca o id da questão
                let numberRootToBeSorted: number, idQuestion: number;
                database.list('/question_filter/' + rootSearch).valueChanges().subscribe(questionsIdentifiers => {
                    let sizeOfRoot: number = questionsIdentifiers.length;
                    numberRootToBeSorted = Math.floor(Math.random() * (sizeOfRoot - 1))
                    idQuestion = questionsIdentifiers[numberRootToBeSorted] as number;
                    // Se a pergunta já foi respondida anteriormente, busca uma nova pergunta
                    if (this.existOnList(UserServices.getUser().getAnswered(), idQuestion))
                        this.getQuestion(database, parameters);
                    else{
                        this.getQuestionById(idQuestion, database).then(question => {
                            resolve(this.prepareQuestion(question));
                        });
                    }
                });
            }else{
                // Busca aleatoriamente
                let numberQuestion: number = this.aleatoryNumberQuestion();

                // Se a pergunta já foi respondida anteriormente, busca uma nova pergunta
                if (this.existOnList(UserServices.getUser().getAnswered(), numberQuestion))
                    this.getQuestion(database, parameters);
                else {
                    this.getQuestionById(numberQuestion, database).then(question => {
                        resolve(this.prepareQuestion(question));
                    });
                }
            }
        });
    }

    private static getQuestionById(idQuestion: number, database: AngularFireDatabase): Promise<any>{
        return new Promise((resolve, reject) => {
            // Busca a questão selecionada no banco de dados
            database.list('/question/', 
                ref => ref.orderByChild("idQuestion").
                            equalTo(idQuestion).
                            limitToFirst(1)).
            valueChanges().subscribe(questions => {
                resolve(this.prepareQuestion(questions[0]));
            });
        })
    }

    private static prepareQuestion(question: any): Question{
        //Cria as variáveis locais apenas para armazenar temporariamente os dados antes de criar a questão
        let alternatives: Array<String>,
            idQuestion: number, strQuestion: string, answer: string, textBiblical: string, 
            levelQuestion: number, testamento: string, secaoBiblia: string, referenciaBiblica: string;

        alternatives = question.alternatives;
        answer = question.answer;
        idQuestion = question.idQuestion;
        levelQuestion = question.levelQuestion;
        strQuestion = question.question;
        referenciaBiblica = question.referenciaBiblica;
        secaoBiblia = question.secaoBiblia;
        testamento = question.testamento;
        textBiblical = question.textBiblical;

        // Chamada de função que troca a ordem das questões e também altera o índice da resposta correta para identificá-la posteriormente
        let alternatives_and_answer: Array<Object> = [];
        alternatives_and_answer.push(answer);
        alternatives_and_answer.push(alternatives);
        alternatives_and_answer = this.randomizeAlternatives(alternatives_and_answer);

        //Instancia a nova questão
        return new Question(    idQuestion, strQuestion, parseInt(<string> alternatives_and_answer[0]), 
                                <Array<string>> alternatives_and_answer[1], textBiblical, levelQuestion, 
                                testamento, secaoBiblia, referenciaBiblica);
    }

    private static randomizeAlternatives(alternatives_and_answer: Array<Object>): Array<Object>{
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

    private static existOnList(list: Array<Object>, object: Object): boolean{
        // Verifica se o objeto passado como parâmetro existe na lista
        for (let i: number = 0; i < list.length; i++){
          if (list[i] == object)
            return true;
        }
    
        return false;
    }

    private static aleatoryNumberQuestion(): number{
        let maxNumberQuestion_Debug: number = 129;
        return Math.floor(Math.random() * (maxNumberQuestion_Debug - 1)) + 1;
    }
}