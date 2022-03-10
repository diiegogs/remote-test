import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as firebase from 'firebase';


import { environment } from 'src/environments/environment';
import { RemoteModel } from '../commons/modelRemote';

@Injectable(
{
  providedIn: 'root'
})

export class RemoteService implements OnInit
{
  private observerResource$  = new Subject<RemoteModel>();
  
  private modelRemote : RemoteModel=
  {
      geocerca    : false,
      maintenance : false,
      timeQuery   : 0
  }
  
  initFirebase = firebase.initializeApp(environment.firebase);

  initAnalytica = firebase.analytics(this.initFirebase);

  initRemotConfig = firebase.remoteConfig();

  // responseSettings : firebase.remoteConfig.RemoteConfig; // tipado

  constructor() { }

  ngOnInit(): void  
  {
  }

  configLocale(timer:number=36000000) // config local of service remoteConfig
  {
    this.initRemotConfig.defaultConfig =
    {
      "geocerca"    : false,
      "maintenance" : false,
      "timeQuery"   : timer
    }
    if(this.modelRemote.maintenance)
    {
      this.initRemotConfig.settings.minimumFetchIntervalMillis = this.modelRemote.timeQuery;
      // console.log('entro en esquema', this.initRemotConfig.getAll());
      // return this.initRemotConfig;
    }
      else {
        this.initRemotConfig.settings.minimumFetchIntervalMillis =  timer;
      }
      console.log('entro en esquema', this.initRemotConfig.getAll());

      return this.initRemotConfig;
    
    // return this.initRemotConfig;
  }
  
  getRemoteValues() : Observable<RemoteModel>
  {
    this.configLocale(); //get configuration local
    // console.info('impresion de config local', this.configLocale().getAll());
    this.initRemotConfig.fetchAndActivate()   
    .then(()=>
    {
      this.modelRemote =
      {
        geocerca    : this.initRemotConfig.getValue('geocerca').asBoolean(),
        maintenance : this.initRemotConfig.getValue('maintenance').asBoolean(),
        timeQuery   : this.initRemotConfig.getValue('timeQuery').asNumber()
      };

      console.log('value timer', this.modelRemote.timeQuery);

      if(this.modelRemote.maintenance === true)
      {
        console.log('entro a validar', this.modelRemote.maintenance);
        this.configLocale(this.modelRemote.timeQuery);
        console.log('imrpimo config actualizado', this.configLocale(this.modelRemote.timeQuery).getAll())
      } 
        else 
        {
          console.log('Usando config default');
          return;
        }
      
      this.observerResource$.next(
      {
        geocerca : this.modelRemote.geocerca,
        maintenance : this.modelRemote.maintenance
      });
    })
    .catch(e=> console.info('error', e));
    
    return this.observerResource$.asObservable();
  }


}
