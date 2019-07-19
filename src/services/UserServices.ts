import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

//import { take } from 'rxjs/operators'

import { User } from "../model/User";

export class UserServices{

    // Singleton implementation
    private static _instance: UserServices;
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }

    private static user: User = null;
    public static setUser(user: User): void{
        this.user = user;
    }
    public static getUser(): User{
        return this.user;
    }

    public static login(firebaseAuthentication: AngularFireAuth, email: string, password: string): Promise<string>{
        // Função responsável por fazer o login do usuário no Firebase Authentication
        return new Promise((resolve, reject) => {           
            firebaseAuthentication.auth.signInWithEmailAndPassword(email, password)
            .then((success => {
                // Devolve o uid do usuário para que a camada anterior faça o login
                resolve(success.user.uid);
            })).catch((error => {
                switch(error.name){
                    case 'auth/invalid-email':  reject('O endereço de e-mail informado não é válido.'); break;
                    case 'auth/user-disabled':  reject('O usuário correspondente ao e-mail informado foi desativado.'); break;
                    case 'auth/user-not-found': reject('Não existe nenhum usuário cadastrado com este e-mail.');    break;
                    case 'auth/wrong-password': reject('A senha digitada não corresponde à senha cadastrada para este endereço de e-mail.');    break;
                    default:                    reject(error.message + "\t" + error.stack);
                }
            }));
        });
    }

    public static register(auth: AngularFireAuth, db: AngularFireDatabase, name: string, email: string, password: string): Promise<User>{
        // Função responsáel por criar um usuário no Firebase Authentication com base nos parâmetros passados

        return new Promise((resolve, reject) => {
            // Tenta criar o usuário com base no e-mail e senha
            auth.auth.createUserWithEmailAndPassword(email, password)
                .then((success => {
                    // Pega o UID do usuário no Firebase e cria o usuário localmente
                    let user: User = new User(success.user.uid);
                    user.setName(name);
                    user.setEmail(email);

                    // Salva o usuário criado no Firebase Authentication no Firebase Database
                    this.updateUserInDb(db, user);

                    // Devole à camada anterior o usuário criado
                    resolve(user);
                })).catch((error =>{
                    reject(error.message + "\t" + error.stack);
                }));
        });
    }

    public static updateUserInDb(db: AngularFireDatabase, user: User): void{
        //Todas as datas são gravadas em milissegundos
        db.object('/usuario/' + user.getUid()).update({
            'email': user.getEmail(),
            'name': user.getName(),
            'score': user.getScore(),
            'lastGame': user.getLastGame().getTime(),
            'firstAccess': user.getFirstAccess().getTime(),
            'bonus/alternative': user.getBonus().getAlternative(),
            'bonus/biblicalReference': user.getBonus().getBiblicalReference(),
            'bonus/time': user.getBonus().getTime(),
            'bonus/lastBonusReceived': user.getBonus().getLastBonusReceived().getTime(),
            'preferences': user.getPreferences(),
            'answeredList': user.getAnswered()
        });
    }

    public static getDbUser(db: AngularFireDatabase, userUID: string): Promise<User>{
        //Função responsável por buscar o usuário no banco de dados

        return new Promise((resolve) => {
            this.user = new User(userUID);

            db.object('/usuario/' + userUID).valueChanges().subscribe(_snapshot => {
                let snapshot: any = _snapshot;

                switch(snapshot.key){
                    case 'email': { this.user.setEmail(snapshot.val());  break;  }
                    case 'name': { this.user.setName(snapshot.val());  break;  }
                    case 'score': { this.user.setScore(snapshot.val());  break;  }
                    case 'lastGame': { this.user.setLastGame(new Date(snapshot.val()));  break;  }
                    case 'firstAccess': { this.user.setFirstAccess(new Date(snapshot.val()));  break;  }
                    case 'bonus': { 
                        let bonus: User.Bonus = new User.Bonus();
                        bonus.setLastBonusReceived(new Date(snapshot.val().lastBonusReceived));
                        bonus.setAlternative(snapshot.val().alternative);
                        bonus.setBiblicalReference(snapshot.val().biblicalReference);
                        bonus.setTime(snapshot.val().time);
                        this.user.setBonus(bonus);
                        break;
                    }
                    case 'preferences': { 
                        let preferencias: User.Preferences = new User.Preferences();
                        preferencias.setSound(snapshot.val().sound);
                        preferencias.setVibration(snapshot.val().vibration);
                        this.user.setPreferences(preferencias);
                        break;
                    }
                    case 'answeredList': { this.user.setAnswered(snapshot.val());  break;  }
                }

                resolve(this.user);
            });
        });
    }
}