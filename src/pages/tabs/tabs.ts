import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ProfilePage } from '../profile/profile';
import { GameParametersPage } from '../gameparameters/gameparameters';
import { HelpPage } from '../help/help';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = GameParametersPage;
  tab2Root = AboutPage;
  tab3Root = ProfilePage;
  tab4Root = HelpPage;

  constructor() {

  }
}
