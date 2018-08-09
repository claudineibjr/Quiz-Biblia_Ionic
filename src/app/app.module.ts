import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ProfilePage } from '../pages/profile/profile';
import { GamePage } from '../pages/game/game';
import { MainPage } from '../pages/main/main';
import { LoginPage } from '../pages/login/login';
import { HelpPage } from '../pages/help/help';
import { GameParametersPage } from '../pages/gameparameters/gameparameters';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { Facebook } from '@ionic-native/facebook'

import { NativeAudio } from '@ionic-native/native-audio';

import { IonicStorageModule } from '@ionic/storage';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyBCcwdOZ_AVVnyFxk4am2xTT3WvUJcEWN8",
  authDomain: "quizbiblico-b3eec.firebaseapp.com",
  databaseURL: "https://quizbiblico-b3eec.firebaseio.com",
  storageBucket: "quizbiblico-b3eec.appspot.com",
  messagingSenderId: "739186926536"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ProfilePage,
    GamePage,
    MainPage,
    LoginPage,
    HelpPage,
    GameParametersPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features    
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ProfilePage,
    GamePage,
    MainPage,
    LoginPage,
    HelpPage,
    GameParametersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    NativeAudio,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
