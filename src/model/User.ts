export class User{

    private email: string;
    private name: string;
    private uid: string;
    private imageLink: string;
    private answeredList: Array<number> = [];
    private score: number;
    private lastGame: Date;
    private firstAccess: Date;
    private preferences: User.Preferences = new User.Preferences();
    private bonus: User.Bonus = new User.Bonus();

    constructor(uid: string){
        this.uid = uid;
    }

    public toString(): string{
        let text: string = '';

        text =  'Email: ' + this.email + '\n' +
                'Nome: ' + this.name + '\n' +
                'Uid: ' + this.uid + '\n' +
                'ImageLink: ' + this.imageLink + '\n' +
                'Score: ' + this.score + '\n' +
                'Último Jogo: ' + this.lastGame.toString() + '\n' +
                'Primeiro Acesso: ' + this.firstAccess.toString() + '\n' +
                'Respondidas: ' + this.answeredList + '\n' +
                'Bonus: {\n' +
                '   bonusTempo: ' + this.bonus.getTime() + '\n' +
                '   bonusAlternativa: ' + this.bonus.getAlternative() + '\n' +
                '   bonusReferenciaBiblica: ' + this.bonus.getBiblicalReference() + '\n' +
                '   ultimoBonusRecebido: ' + this.bonus.getLastBonusReceived().toString() + '}\n' +
                'Preferências: {\n' +
                '   sons: ' + this.preferences.getSound() + '\n' +
                '   vibração: ' + this.preferences.getVibration() + '}';

        return text;
    }

    public getEmail(): string               {return this.email;}
    public setEmail(email: string): void    {this.email = email;}

    public getNome(): string            {return this.name;}
    public setNome(nome: string): void  {this.name = nome;}

    public getUid(): string {return this.uid;}

    public getImageLink(): string                   {return this.imageLink;}
    public setImageLink(imageLink: string): void    {this.imageLink = imageLink;}

    public getScore(): number               {return this.score;}
    public setScore(score: number): void    {this.score = score;}
    public addScore(points: number): void   {this.score += points;}

    public getLastGame(): Date                  {return this.lastGame;}
    public setLastGame(lastGame: Date): void    {this.lastGame = lastGame;}

    public getFirstAccess(): Date                   {return this.firstAccess;}
    public setFirstAccess(firstAccess: Date): void  {this.firstAccess = firstAccess;}

    public getAnswered(): Array<number>                 {return this.answeredList;                   }
    public setAnswered(answeredList: Array<number>)     {this.answeredList = answeredList;}
    public addAnswered(answeredQuestion: number): void  {this.answeredList.push(answeredQuestion);   }

    public getPreferences(): User.Preferences                   {return this.preferences;}
    public setPreferences(preferences: User.Preferences): void  {this.preferences = preferences;}

    public getBonus(): User.Bonus               {return this.bonus;}
    public setBonus(bonus: User.Bonus): void    {this.bonus = bonus;}
}

export module User{
    
    export class Bonus{
        private time: number;
        private alternative: number;
        private biblicalReference: number;
        private lastBonusReceived: Date;

        constructor(){
            
        }

        public getTime(): number        {return this.time;}
        public setTime(time: number)    {this.time = time;}
        public decTime(): void          {this.time -= 1;}

        public getAlternative(): number             {return this.alternative;}
        public setAlternative(alternative: number)  {this.alternative = alternative;}
        public decAlternative(): void               {this.alternative -= 1;}

        public getBiblicalReference(): number                   {return this.biblicalReference;}
        public setBiblicalReference(biblicalReference: number)  {this.biblicalReference = biblicalReference;}
        public decBiblicalReference(): void                     {this.biblicalReference -= 1;}

        public getLastBonusReceived(): Date                         {return this.lastBonusReceived;}
        public setLastBonusReceived(lastBonusReceived: Date): void  {this.lastBonusReceived = lastBonusReceived;}
    }

    export class Preferences{
        private sound: boolean;
        private vibration: boolean;    

        constructor(){
            
        }

        public getSound(): boolean {return this.sound;}
        public setSound(sound: boolean): void{this.sound = sound;}

        public getVibration(): boolean {return this.vibration;}
        public setVibration(vibration: boolean): void{this.vibration = vibration;}

    }

}