import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../model/User';
import { UserServices } from '../../services/UserServices';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {
  user_Email: string;
  user_Name: string;
  user_Score: number;
  user_AnsweredNumber: number;
  
  user_Preferences_Sound: boolean;
  user_Preferences_Vibration: boolean;

  user_Bonus_Alternative: number;
  user_Bonus_BiblicalReference: number;
  user_Bonus_Time: number;
  user_Bonus_LastReceived: Date;

  constructor(public navCtrl: NavController, public database: AngularFireDatabase) {
    this.user_Email = UserServices.getUser().getEmail();
    this.user_Name = UserServices.getUser().getName();
    this.user_Score = UserServices.getUser().getScore();
    this.user_AnsweredNumber = UserServices.getUser().getAnswered().length;

    this.user_Preferences_Sound = UserServices.getUser().getPreferences().getSound();
    this.user_Preferences_Vibration = UserServices.getUser().getPreferences().getVibration();

    this.user_Bonus_Alternative = UserServices.getUser().getBonus().getAlternative();
    this.user_Bonus_BiblicalReference = UserServices.getUser().getBonus().getBiblicalReference();
    this.user_Bonus_Time = UserServices.getUser().getBonus().getTime();
    this.user_Bonus_LastReceived = UserServices.getUser().getBonus().getLastBonusReceived();
  }

  cancel(): void{
    this.user_Name = UserServices.getUser().getName();
    this.user_Preferences_Sound = UserServices.getUser().getPreferences().getSound();
    this.user_Preferences_Vibration = UserServices.getUser().getPreferences().getVibration();
  }

  save(): void{
    UserServices.getUser().setName(this.user_Name);
    UserServices.getUser().getPreferences().setSound(this.user_Preferences_Sound);
    UserServices.getUser().getPreferences().setVibration(this.user_Preferences_Vibration);

    UserServices.updateUserInDb(this.database, UserServices.getUser());
  }

  deleteAccount(): void{

  }

  resetAccount(): void{

  }

}