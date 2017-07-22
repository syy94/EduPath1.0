import { Component, ViewChild } from '@angular/core';

import { NavController, ToastController, Searchbar, InfiniteScroll, NavParams } from 'ionic-angular';

import { Http, Response, ResponseContentType, Headers} from '@angular/http';
import { Course } from '../course/course';
import { Compare } from '../compare/compare';
import { PopoverController } from 'ionic-angular';
import { SortMenu } from '../../popovers/sortmenu/sortmenu';
import { LoadCourses, SearchCourses } from '../../services/service'

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AppPreferences } from '@ionic-native/app-preferences';

@Component({
    selector: 'page-courseList',
    templateUrl: 'courseList.html'
})
export class CourseList {
    @ViewChild('searchbar') searchbar: Searchbar;
    infEnabled: boolean = true;

    private search_id: number = 0;
    private search_key: string;
    title: string = "All";
    shouldSearch: boolean = false;
    isActivated: boolean = true;
    sort: string = "Course ID";

    private temp: Array<any> = [];
    selection: Array<any> = [];
    courses: Array<any> = [];
    favs: Array<string> = [];
    isLoading: boolean = true;

    //prefs not working on ripple emulator, use device
    prefs: String = "nadah";

    //private db: SQLiteObject = null;
    private loadCourses: LoadCourses;
    private searchCourses: SearchCourses;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private http: Http,
        public toastCtrl: ToastController,
        private appPrefs: AppPreferences,
        public popoverCtrl: PopoverController,
        private sqlite: SQLite
    ) {

        document.addEventListener('pause', () => {
            this.ionViewWillLeave();
        });

        document.addEventListener('resume', () => {
            this.ionViewDidEnter();
        });

        let schoolFilter = navParams.get("school");

        this.loadCourses = new LoadCourses(http, this.sort, this.courses.length);

        if (schoolFilter) {
            this.loadCourses.setSchool(schoolFilter);
            this.title = navParams.get("title");
        }

        this.isLoading = true;
        this.loadCourses.getCourses((res) => {
            this.courses = res
            this.isLoading = false;
        });
        this.searchCourses = new SearchCourses(http);
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
        return this.favs.indexOf(id) > -1;
    }

    ionViewDidEnter() {
        this.appPrefs.fetch("favourites").then((res: string) => {
            if (res != null) {
                console.log("get" + res)
                this.favs = JSON.parse(res);
            }
        });
        console.log('ENTER');
    }

    ionViewWillLeave() {
        console.log(JSON.stringify(this.favs));
        this.appPrefs.store("favourites", JSON.stringify(this.favs)).then(res => {
            console.log("store" + JSON.stringify(res));
        });
        console.log('Exit');
    }

    toggleSearch() {
        this.infEnabled = true;
        this.search_key = '';
        this.shouldSearch = !this.shouldSearch;
        if (this.shouldSearch) {
            this.temp = this.courses;
            this.courses = [];
            //timeout so searchbar have time to be created and focus set
            setTimeout(() => {
                this.searchbar.setFocus();
            });
        } else {
            this.courses = this.temp;
        }
    }

    search(event) {
        this.search_key = event.target.value;

        if (this.search_key != null && this.search_key.length > 1) {
            this.isLoading = true;
            this.search_id = this.searchCourses.key(this.search_key, 0, (res, task_id) => {
                this.isLoading = false;
                if (this.search_id == task_id)
                    this.courses = res;
            });
        }
    }

    sortBy(event) {
        let popover = this.popoverCtrl.create(SortMenu);
        popover.present({
            ev: event
        });

        popover.onDidDismiss((popoverData) => {
            console.log(JSON.stringify(popoverData));
            if (popoverData != null && this.sort != popoverData.name) {
                this.isLoading = true;
                this.sort = popoverData.name;
                //instead of showing empty add some vars to show loading
                this.courses.length = 0;
                this.loadCourses.setOffset(0).setSort(popoverData.name).getCourses(res => {
                    this.courses = res;
                    this.isLoading = false;
                });
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

        event.preventDefault();
    }

    doInfinite(infiniteScroll: InfiniteScroll) {
        //this.infScroll = infiniteScroll;
        if (!this.shouldSearch) {
            this.loadCourses.setOffset(this.courses.length).getCourses(res => {

                this.courses = this.courses.concat(res);

                infiniteScroll.complete();
            }, err => {
                this.infEnabled = false;
            });
        } else {
            this.search_id = this.searchCourses.key(this.search_key, this.courses.length, (res, task_id) => {
                infiniteScroll.complete();
                if (this.search_id == task_id)
                    this.courses = this.courses.concat(res);
                if (res.length == 0) {
                    this.infEnabled = false;
                }
            }, err => {
                this.infEnabled = false;
            });
        }
    }

    favourite(event, id: string) {
        console.log('favs clicked');
        let index = this.favs.indexOf(id);
        if (index > -1) {
            this.favs.splice(index, 1);
        } else {
            this.favs.push(id);
        }
        this.ionViewWillLeave();
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
