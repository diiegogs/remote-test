import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { initializeApp } from "firebase";
import "@angular/compiler";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
  title = 'try3RemotConfig';

  initFirebase  = initializeApp(environment.firebase);
  
  initAnalytics = firebase.analytics(this.initFirebase);

  remot_config = firebase.remoteConfig();


  get configRemot()
  {
    this.remot_config.settings.minimumFetchIntervalMillis = 3600000;

    this.remot_config.defaultConfig = { "maintenance" : "true", "geocerca" : "true" };

    return this.remot_config;
  }

  constructor(){ console.clear(); }

  ngOnInit(): void 
  {
    this.configRemot;

    console.warn("::::::::::::::::::::::::::::");
    
    this.remot_config.fetchAndActivate().then(flag=>console.info('tengo bandera', flag)).catch(err=>console.info('ERROR', err));
    
    console.warn('MAINTENANCE : ', this.maintenance);
    
    console.warn('GEOCERCA : ', this.geocerca);
  }

  get maintenance () : boolean { return this.remot_config.getValue("maintenance").asBoolean() }

  get geocerca () : boolean { return this.remot_config.getValue("geocerca").asBoolean(); }
}
