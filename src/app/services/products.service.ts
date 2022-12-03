import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Observable, delay, throwError, catchError, retry, tap } from 'rxjs'
import { IProduct } from '../models/product'
import { ErrorService } from './error.service'

@Injectable({
    providedIn: 'root'
})

export class productService {
    constructor(private http: HttpClient, private errorService: ErrorService) { }

    products: IProduct[] = []

    getAll(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>('https://fakestoreapi.com/products', {
            params: new HttpParams().append('limit', 5)
            //fromString: 'limit=5' 
            //fromObject: {limit:5} 
        }).pipe(
            delay(200),
            retry(2),
            tap((product) => this.products = product),
            catchError(this.errorHandler.bind(this))
        )
    }

    create(product: IProduct): Observable<IProduct> {
        return this.http.post<IProduct>('https://fakestoreapi.com/products', product).pipe(
            tap(response => {
                this.products.push(response)
                // console.log(this.products)
            })
        )
    }

    private errorHandler(error: HttpErrorResponse) {
        this.errorService.handle(error.message)
        return throwError(() => error.message)
    }
}