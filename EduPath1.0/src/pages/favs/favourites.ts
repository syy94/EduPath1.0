import { Component, ViewChild } from '@angular/core';

import { NavController, ToastController, Searchbar, InfiniteScroll } from 'ionic-angular';

import { Http, Response, ResponseContentType, Headers} from '@angular/http';
import { Course } from '../course/course';
import { Compare } from '../compare/compare';
import { PopoverController } from 'ionic-angular';
import { SortMenu } from '../../popovers/sortmenu/sortmenu';
import { FavService } from '../../services/service'
import { courseObjLayout } from '../../services/courseobjlayout'
import { MultiCompare } from "../multicompare/multicompare";

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AppPreferences } from '@ionic-native/app-preferences';

@Component({
    selector: 'page-favourites',
    templateUrl: 'favourites.html'
})
export class FavList {
    //infinite scroll not in use for this page for now
    //infEnabled: boolean = true;

    @ViewChild('searchbar') searchbar: Searchbar;

    private search_id: number = 0;
    private search_key: string;
    shouldSearch: boolean = false;
    isActivated: boolean = true;

    private temp: Array<courseObjLayout> = [];
    selection: Array<courseObjLayout> = [];
    courses: Array<courseObjLayout> = [];
    favs: Array<string> = [];
    favService: FavService;
    isEmpty: boolean = false;

    constructor(
        public navCtrl: NavController,
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

        this.favService = new FavService(http);
    }

    isFav(id) {
        return this.favs.indexOf(id) > -1;
    }

    ionViewDidEnter() {
        this.appPrefs.fetch("favourites").then((res: string) => {
            if (res != null) {
                if (res.length != 0) {
                    this.favs = JSON.parse(res);
                }
                this.favService.get(this.favs, res => {
                    this.courses = res;
                    this.isEmpty = this.courses.length == 0;
                });
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
        //this.infEnabled = true;
        this.search_key = '';
        this.shouldSearch = !this.shouldSearch;
        if (this.shouldSearch) {
            this.temp = this.courses;
            setTimeout(() => {
                this.searchbar.setFocus();
            });
        } else {
            this.courses = this.temp;
        }
    }

    search(event) {
        this.search_key = event.target.value;
        console.log(JSON.stringify(event.target.value));
    }

    courseClick(event, course) {
        this.navCtrl.push(Course, { 'course': course });
    }

    quickCompare(event) {
        this.navCtrl.push(Compare, { 'courses': this.selection });
    }

    compareAll(event) {
        this.navCtrl.push(MultiCompare, { 'courses': this.courses });
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

    //doInfinite(infiniteScroll: InfiniteScroll) {
    //    //this.infScroll = infiniteScroll;
    //    if (!this.shouldSearch) {

    //    } 
    //}

    favourite(event, id: string) {
        console.log('favs clicked');      
        //this.isFav = !this.isFav;
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
