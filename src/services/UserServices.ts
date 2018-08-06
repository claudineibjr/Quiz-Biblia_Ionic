import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/take';

import { User } from "../model/User";
import { resolveDep } from '@angular/core/src/view/provider';

export class UserServices{

    // Singleton implementation
    private static _instance: UserServices;
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }

    private static user: User = null;
    public static getUser(): User{
        return this.user;
    }

    public static login(firebaseAuthentication: AngularFireAuth, email: string, password: string): Promise<string>{       
        return new Promise((resolve, reject) => {           
            firebaseAuthentication.auth.signInWithEmailAndPassword(email, password)
            .then((success => {
                resolve(success.uid);
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

    public static getDbUser(db: AngularFireDatabase, userUID: string): void{
        //Função responsável por buscar o usuário no banco de dados

        this.user = new User(userUID);

        db.object('/usuario/' + userUID, { preserveSnapshot: true }).take(1).subscribe(snapshots => {
            snapshots.forEach(snapshot =>{
                switch(snapshot.key){
                    case 'email': { this.user.setEmail(snapshot.val());  break;  }
                    case 'name': { this.user.setNome(snapshot.val());  break;  }
                    case 'score': { this.user.setScore(snapshot.val());  break;  }
                    case 'lastGame': { this.user.setLastGame(snapshot.val());  break;  }
                    case 'firstAccess': { this.user.setFirstAccess(snapshot.val());  break;  }
                    case 'bonus': { 
                        let bonus: User.Bonus = new User.Bonus();
                        bonus.setLastBonusReceived(snapshot.val().lastBonusReceived);
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
            });

        });
    }
}