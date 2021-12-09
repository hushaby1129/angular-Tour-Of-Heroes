import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from "./hero"
import { HEROES } from "./mock-heroes";
import { MessageService } from "./message.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class HeroService {

    private heroesUrl = 'api/heroes';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-type' : 'application/json'
        })
    };

    constructor(
        private messageService: MessageService
        , private http: HttpClient
    ) {
    }

    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
                tap(_ => this.log('fetched heroes')),
                catchError(this.handleError<Hero[]>('getHeroes()', []))
            );
    }

    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url)
            .pipe(
                tap(_ => this.log(`fetched hero id = ${id}`))
                , catchError(this.handleError<Hero>(`getHero id = ${id}`))
            );
    }

    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any) : Observable<T> => {
            console.error(error);
            this.log(`${operation} failed : ${error.message}`);
            return of(result as T);
        }
    }

    updateHero(hero: Hero) {
        return this.http.put(
            this.heroesUrl
            , hero
            , this.httpOptions
        ).pipe(
            tap(_ => this.log(`updated hero id=${hero.id}`)),
            catchError(this.handleError<any>('updateHero'))
        )
    }

    addHero(hero: Hero): Observable<Hero> {
        return this.http.post<Hero>(
            this.heroesUrl
            , hero
            , this.httpOptions
        ).pipe(
            tap((newHero: Hero) => this.log(`added hero \w id = ${newHero.id}`)),
            catchError(this.handleError<Hero>('addHero'))
        );
    }


}
