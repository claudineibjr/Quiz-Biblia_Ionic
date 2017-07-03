export class User{

    private email: string;
    private nome: string;
    private uid: string;
    private imageLink: string;
    private answeredList: Array<number>;
    private score: number;
    private lastGame: Date;
    private firstAccess = Date;
    private preferences = new user.Preferences();
    private bonus = new user.Bonus();

    constructor(uid: string){
        this.uid = uid;
    }

    public getEmail(){return this.email;}

    public getAnswered(): Array<number>                 {   return this.answeredList;                   }
    public addAnswered(answeredQuestion: number): void  {   this.answeredList.push(answeredQuestion);   }

}

module user{
    
    export class Bonus{
        private bonusTempo: number;
        private bonusAlternativa: number;
        private bonusReferenciaBiblica: number;
        private ultimoBonusRecebido: Date;

        constructor(){
            
        }        
    }

    export class Preferences{
        private sons: boolean;
        private vibracao: boolean;    

        constructor(){
            
        }        
    }

}