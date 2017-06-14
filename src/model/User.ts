import { Preferences } from '../model/Preferences'
import { Bonus } from '../model/Bonus'

export class User{

    private email: string;
    private nome: string;
    private uid: string;
    private linkImagem: string;
    private respondidas: Array<number>;
    private pontuacao: number;
    private ultimoJogo: Date;
    private primeiroAcesso = Date;
    private preferences = new Preferences();
    private bonus = new Bonus();

    constructor(){
        
    }

    public getEmail(){
        return this.email;
    }
        

}