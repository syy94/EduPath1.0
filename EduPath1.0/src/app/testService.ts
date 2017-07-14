import { Injectable } from '@angular/core';


//Can't seem to get injectable services working. if it works in the future change all classes in service.ts to injectables
// guide: https://angular.io/guide/dependency-injection#dependency-injection
@Injectable()
/** Dummy version of an authenticated user service */
export class UserService {
    userName = 'Sherlock Holmes';
}