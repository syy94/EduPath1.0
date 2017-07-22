import {Component, Input, Output, EventEmitter} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import { Http, Headers} from "@angular/http";
import { AppPreferences } from '@ionic-native/app-preferences';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { courseObjLayout } from "../../services/courseobjlayout";

@Component({
    templateUrl: "course.component.html",
    selector: "course-item"
})
export class CourseItem {
    @Input("course") course: courseObjLayout;

    @Input("multi") courses: boolean = false;
    @Input("current-id") curr: string;

    @Output() leftClick: EventEmitter<any> = new EventEmitter();
    @Output() rightClick: EventEmitter<any> = new EventEmitter();
    @Output() selector: EventEmitter<any> = new EventEmitter();

    output: string = "";

    private nav: NavController;
    private favs: Array<string> = [];

    constructor(nav: NavController, public http: Http, private appPrefs: AppPreferences, private iab: InAppBrowser) {
        document.addEventListener('pause', () => {
            this.ionViewWillLeave();
        });

        document.addEventListener('resume', () => {
            this.ionViewDidEnter();
        });
        this.nav = nav;
        this.ionViewDidEnter();
    }

    isFav(id) {
        return this.favs.indexOf(id) > -1;
    }

    //Does not seem to automatically run when view in entered
    //maybe if used like this it is not part of the lifecycle?
    ionViewDidEnter() {
        this.appPrefs.fetch("favourites").then((res: string) => {
            if (res != null) {
                console.log("get" + res)
                this.favs = JSON.parse(res);
            }
        });
        console.log('ENTER');
    }

    //Does not seem to automatically run when view in entered
    //maybe if used like this it is not part of the lifecycle?
    ionViewWillLeave() {
        console.log(JSON.stringify(this.favs));
        this.appPrefs.store("favourites", JSON.stringify(this.favs)).then(res => {
            console.log("store" + JSON.stringify(res));
        });
        console.log('Exit');
    }

    right(event) {
        this.rightClick.emit(event);
    }

    left(event) {
        this.leftClick.emit(event);
    }

    select(event) {
        this.selector.emit(event);
    }

    toggleFav(id) {
        let index = this.favs.indexOf(id);

        if (index > -1) {
            this.favs.splice(index, 1);
        } else {
            this.favs.push(id);
        }

        this.ionViewWillLeave();
        event.stopPropagation();
    }

    isArray(header) {
        return (this.course.structure[header] instanceof Array);
    }

    goToWebsite(course_url) {
        const browser = this.iab.create(course_url);
    }

    isHidden(header, subHeader) {
        if (this.course.structure == null) {
            return;
        }

        let headerObj;
        if (subHeader != null) {
            headerObj = this.course.structure[header][subHeader];
        } else {
            headerObj = this.course.structure[header];
        }

        if (headerObj.hidden == null) {
            //hidden by default
            return true;
        } else {
            return headerObj.hidden;
        }
    }

    toggleHidden(event, header, subHeader) {
        if (this.course.structure == null) {
            return;
        }

        let headerObj;
        if (subHeader != null) {
            headerObj = this.course.structure[header][subHeader];
        } else {
            headerObj = this.course.structure[header];
        }

        if (headerObj.hidden != null) {
            headerObj["hidden"] = !headerObj.hidden;
        } else {
            headerObj["hidden"] = false;
        }
        event.stopPropagation();
    }
}