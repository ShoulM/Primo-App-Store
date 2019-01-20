import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import * as _forEach from "lodash/forEach";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {FileUploaderService} from "./file-uploader.service";
import {Angulartics2GoogleAnalytics} from "angulartics2/ga";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private _config: { view: string, url: string, dirName: string, ve: string, useCentral: string, installedFeatures: string[] };
  private $cookies: CookieService;

  constructor(private $http: HttpClient,
              private route: ActivatedRoute,
              private router: Router) {
    this.$cookies = new CookieService(window.document);
    let params = this.route.snapshot.queryParams;
    let url = params['url'] || 'https://primo-demo.hosted.exlibrisgroup.com:443';
    let view = params['vid'] || 'NORTH';
    let isVe = params['ve'] || 'false';
    let useCentral = params['central'] || 'false';
    let dirName = params['dirName'];
    this._config = {
      'view': view,
      'url': url,
      'dirName': dirName,
      've': isVe,
      'useCentral': useCentral,
      installedFeatures: []
    };
  }

  start(): Observable<any> {
    let config = {params: new HttpParams({fromObject: this.config})};
    this.$cookies.set('urlForProxy', this.config.url);
    this.$cookies.set('viewForProxy', this.config.view);
    this.$cookies.set('ve', this.config.ve);
    this.$cookies.set('useCentral', this.config.useCentral);
    this.$cookies.set('dirName', this.config.dirName ? this.config.dirName : '');

    return new Observable<any>(observer => {
      this.$http.get<any>('/start', config).subscribe(resp => {
        if (+resp.status === 200) {
          let dirName = resp.dirName;
          this.config.dirName = dirName;
          this.$cookies.set('dirName', dirName);
          let searchParams = Object.assign({}, this.route.snapshot.queryParams);
          _forEach({
            'dirName': dirName,
            'url': this.config.url,
            'vid': this.config.view,
            've': this.config.ve,
            'central': this.config.useCentral
          }, (value, key) => {
            searchParams[key] = value;
          });
          this.router.navigate(['.'], {queryParams: searchParams});
          this.config.installedFeatures = resp.installedFeatures;
          console.log('created new directory: ' + this.config.dirName);
        }

        observer.next(resp);
        observer.complete();
      });
    });
  }

  get config() {
    return this._config;
  }

  set config(config) {
    this._config = config;
  }

  get isVe(): boolean {
    return this.config.ve === 'true';
  }

  get isUsingCentralPackage(): boolean {
    return this.config.useCentral === 'true';
  }
}
