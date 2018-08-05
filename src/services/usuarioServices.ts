import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import 'rxjs/add/operator/take';

import { User } from "../model/User";

export class UsuarioService{

    // Singleton implementation
    private static _instance: UsuarioService;
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }

    private static user: User = null;
    public static getUser(): User{
        return this.user;
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