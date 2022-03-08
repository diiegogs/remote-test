import { Injectable, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RemoteModel } from '../commons/modelRemote';

@Injectable(
{
  providedIn: 'root'
})

export class RemoteService implements OnInit
{
  private geocercaPropertie      : boolean = null;

  private modelRemote : RemoteModel =
  {
    geocerca    : false,
    maintenance : false
  }

  private goecercaObserver$ = new Subject<RemoteModel>();
  
  private maintenancePropertie   : boolean = null;
  
  initFirebase = firebase.initializeApp(environment.firebase);

  initAnalytica = firebase.analytics(this.initFirebase);

  initRemotConfig = firebase.remoteConfig();

  constructor() { }

  ngOnInit(): void 
  {
  }

  geocercaValue() : Observable<RemoteModel>
  {
    this.initRemotConfig.defaultConfig = 
    {
      "geocerca"    : false,
      "maintenance" : false 
    };
    
    this.initRemotConfig.settings.minimumFetchIntervalMillis = 5000;
    this.initRemotConfig.fetchAndActivate()
    .then(()=>
    {

      this.modelRemote = {
        geocerca : this.initRemotConfig.getValue('geocerca').asBoolean(),
        maintenance : this.initRemotConfig.getValue('maintenance').asBoolean()
      }
      console.warn('que valores', this.modelRemote);
      this.goecercaObserver$.next(
      {
        geocerca : this.modelRemote.geocerca,
        maintenance : this.modelRemote.maintenance
      });
      
    })
    .catch((err)=>
    {
      console.error('get error remot config', err);
    });
    return this.goecercaObserver$.asObservable();
  }
}
