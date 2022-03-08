import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { initializeApp } from "firebase";
import "@angular/compiler";
import { RemoteService } from './services/remote.service';
import { Observable } from 'rxjs';
import { RemoteModel } from './commons/modelRemote';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
  title = 'try3RemotConfig';

  observerRemote$ : Observable<RemoteModel>;

  geocerca : boolean;

  maintenance : boolean;

  constructor(private rsf : RemoteService) 
  {
    this.observerRemote$ = this.rsf.geocercaValue();
  }

  ngOnInit(): void 
  {
    this.observerRemote$.subscribe((remote)=>
    {
      this.geocerca = remote.geocerca;
      this.maintenance = remote.maintenance;

      console.warn('valores desde consumo:\ngeocerca', this.geocerca,'\nmaintenance', this.maintenance);
    })
  }
  
}
