import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { InteractionService } from './interaction.service';
import { Observable } from 'rxjs/internal/Observable';
import { Welcome } from '../models/welcome.class';
import { Token } from '../models/token.class';
@Injectable({
	providedIn: 'root',
})
export class OauthService {
	private token = new Token();
	constructor(
		private http: HttpClient,
		private interaction: InteractionService
	) {}

	getRequestAccessUrl() {
		let url = new URL('http://www.strava.com/oauth/authorize');
		url.searchParams.append('client_id', environment.client_id);
		url.searchParams.append('response_type', 'code');
		url.searchParams.append('redirect_uri', 'http://localhost:4200/user');
		url.searchParams.append('approval_prompt', 'auto');
		url.searchParams.append(
			'scope',
			'read,read_all,profile:read_all,activity:read,activity:read_all'
		);

		window.location.href = url.toString();
	}

	getToken(): Token {
		return this.token;
	}

	deauthorize() {}

	refreshToken(code: string): Observable<Welcome> {
		const headers = new HttpHeaders().append(
			'Content-Type',
			'application/x-www-form-urlencoded'
		);

		const body: any = {};

		const params = new HttpParams()
			.append('client_id', environment.client_id)
			.append('client_secret', environment.client_secret)
			.append('code', code)
			.append('grant_type', 'authorization_code');

		return this.interaction.post<Welcome>(
			'https://www.strava.com/oauth/token',
			body,
			headers,
			params
		);
	}

	setToken(token: Token) {
		console.log(token);
		this.token = token;
	}
}
