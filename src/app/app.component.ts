import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteModel } from './commons/modelRemote';
import { RemoteService } from './services/remote.service';

@Component(
{
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit
{

  observerFlags$ : Observable<RemoteModel>

  response : RemoteModel;

  constructor(private rs : RemoteService) 
  { 
    console.clear();
    this.observerFlags$ = rs.getRemoteValues();
  }
  
  ngOnInit(): void 
  {
  
  }

  
  
}
