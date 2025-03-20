import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../interface/tarea';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = '/api/tasks';

  constructor(private http: HttpClient) {}

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }
}
