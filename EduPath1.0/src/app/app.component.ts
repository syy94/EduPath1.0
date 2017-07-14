import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { StatusBar, Splashscreen } from 'ionic-native';
import { AppPreferences } from '@ionic-native/app-preferences';

import { CourseList } from '../pages/courselist/courselist';
import { Course } from '../pages/course/course';
import { Compare } from '../pages/compare/compare';
import { FavList } from "../pages/favs/favourites";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = CourseList;

    pages: Array<{ title: string, school?:any, component: any }>;

    constructor(public platform: Platform, private appPrefs: AppPreferences) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: CourseList },
            { title: 'Favourites', component: FavList },
            { title: 'Temasek Polytechnic', school:"TP", component: CourseList },
            { title: 'Nanyang Polytechnic', school: "NYP", component: CourseList },
            { title: 'Ngee Ann Polytechnic', school: "NP", component: CourseList },
            { title: 'Singapore Polytechnic', school: "SP", component: CourseList },
            { title: 'Republic Polytechnic', school: "RP", component: CourseList }
        ];
       
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }

    openPage(page, index) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        let params = {};

        if (index > 1) {
            params["title"] = page.title;
            params["school"] = page.school;
        }

        this.nav.setRoot(page.component, params);
    }
}
