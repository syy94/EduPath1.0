import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import { Http, Response, ResponseContentType, Headers} from '@angular/http';
import { Course } from '../course/course';
import { Compare } from '../compare/compare';
import { AppPreferences } from '@ionic-native/app-preferences';
import { PopoverController } from 'ionic-angular';
import { SortMenu } from '../../popovers/sortmenu/sortmenu';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
    selector: 'page-courseList',
    templateUrl: 'courseList.html'
})
export class CourseList {
    isActivated: boolean = true;
    favs: Array<string> = []
    sort: String = "Course ID";
    //isFav: boolean = true;
    selection: Array<any> = [];
    courses: Array<any> = [];

    //prefs not working on ripple emulator
    prefs: String = "nadah";

    //private db: SQLiteObject = null;

    constructor(
        public navCtrl: NavController,
        private http: Http,
        public toastCtrl: ToastController,
        private appPrefs: AppPreferences,
        public popoverCtrl: PopoverController,
        private sqlite: SQLite
    ) {
        //un-comment this to use the web data (saving my GAE quota)
        this.loadCourses();

        //database takes too long to debug on ripple first just use list

        //console.log("constructor");
        //this.sqlite.create({
        //    name: 'data.db',
        //    location: 'default'
        //})
        //    .then((db: SQLiteObject) => {
        //        this.db = db;

        //        console.log("creating table");
        //        db.executeSql('create table favourites(id VARCHAR(32))', {})
        //            .then(() => console.log('created table SQL'))
        //            .catch(e => console.log(e));

        //        console.log("insert sample");
        //        db.executeSql('insert into favourites values (C38)', {})
        //            .then(() => console.log('added test faves SQL'))
        //            .catch(e => console.log(e));

        //        console.log("select all");
        //        this.db.executeSql("select * from favourites ", []).then((resultSet) => {
        //            console.log("is favs");
        //            console.log(JSON.stringify(resultSet));
        //        }).catch(e => console.log(e));

        //    })
        //    .catch(e => console.log(e));

        //let sortPref = appPrefs.fetch("sort").

        //appPrefs.watch(true).subscribe(res => {
        //    this.loadCourses()
        //});
    }

    isFav(id) {
        //console.log('is isFav running?');
        //if (this.db == null) {
        //    return false;
        //}

        return this.favs.indexOf(id) > -1;

    }

    sortBy(event) {
        let popover = this.popoverCtrl.create(SortMenu);
        popover.present({
            ev: event
        });

        popover.onDidDismiss((popoverData) => {
            console.log(JSON.stringify(popoverData));
            if (popoverData != null && this.sort != popoverData.name) {
                this.sort = popoverData.name;
                //instead of showing empty add some vars to show loading
                this.courses.length = 0;
                this.loadCourses();
            }
        });
    }

    courseClick(event, course) {
        this.navCtrl.push(Course, { 'course': course });
    }

    quickCompare(event) {
        this.navCtrl.push(Compare, { 'courses': this.selection });
    }

    clearSelection(event) {
        this.selection.length = 0;
        this.updateSelBtn();
    }

    onHold(event, course) {
        if (this.selection.length == 2) {
            let toast = this.toastCtrl.create({
                message: 'Quick Compare can only compare 2 courses',
                duration: 3000
            });
            toast.present();
        } else if (this.selection.indexOf(course) > -1) {
            let toast = this.toastCtrl.create({
                message: 'Course is already selected',
                duration: 3000
            });
            toast.present();
        } else if (this.isActivated) {
            this.selection.push(course);
            this.updateSelBtn();
        }

        //this.appPrefs.store("prefto", "value?").then(res => {
        //    console.log("store" + JSON.stringify(res));
        //    this.appPrefs.fetch("prefto").then(res => {
        //        this.prefs = JSON.stringify(res);
        //        console.log("get" + JSON.stringify(res))
        //    });
        //});
        console.log(typeof event);
        console.log(JSON.stringify(event));


        event.preventDefault();
    }

    doInfinite(infiniteScroll) {
        this.loadCourses(this.courses.length, () => {
            infiniteScroll.complete();
        }, res => {
            if (res == null) {
                infiniteScroll.enable(false);
            }
        });
    }

    loadCourses(offset = 0, then?: () => any, success?: (res) => any, error?: (err) => any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let data = {
            size: 20,
            offset: offset,
            orders: ['id']
        };
        //TODO Find a better way to do this. Enums?
        switch (this.sort) {
            case 'Course ID':
                data.orders = ['id'];
                break;
            case 'Polytechnic':
                data.orders = ['poly', 'name'];
                break;
            case 'Score':
                data.orders = ['score', 'name'];
                break;
        }

        this.http.post('https://edulab-1377.appspot.com/_ah/api/list', JSON.stringify(data), { headers: headers }).subscribe(res => {
            if (res.json() != null) {
                console.log(JSON.stringify(res.json));
                let result = this.addColor(res.json());
                this.courses = this.courses.concat(result);
            }
            if (then instanceof Function) {
                then();
            }

            if (success instanceof Function) {
                success(res.json());
            }

        }, err => {
            if (then instanceof Function) {
                then();
            }
            error(err);
            console.log("fail");
            console.log(JSON.stringify(err));
        });

        /*
        Sample response:
            [{"score": "21", "name": "3D Interactive Media Technology", "poly": "TP"}]
        Array of 1 course
        */
    }

    addColor(courses): Array<any> {
        for (let course of courses) {
            course["color"] = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ","
                + Math.floor(Math.random() * 255) + ")";
        }
        return courses;
    }

    favourite(event, id: string) {
        console.log('favs clicked');
        //this.isFav = !this.isFav;
        let index = this.favs.indexOf(id);
        if (index > -1) {
            this.favs.splice(index, 1);
        } else {
            this.favs.push(id);
        }

        event.stopPropagation();
    }

    removeSelection(event, course) {
        let index = this.selection.indexOf(course);

        if (index > -1) {
            this.selection.splice(index, 1);
        }

        this.updateSelBtn();
    }

    /**
     * @method placeholder to enable the on click and press animation
     */
    placeholder() { }

    compareText: string = 'Hold 1 more course for Quick Compare';
    updateSelBtn() {
        const more = 'Hold 1 more course for Quick Compare';
        const enough = 'Quick Compare';
        this.isActivated = this.selection.length != 2;
        if (this.isActivated) {
            this.compareText = more;
        } else {
            this.compareText = enough;
        }
    }
}
