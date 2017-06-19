import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import { Http, Response, ResponseContentType, Headers} from '@angular/http';
import { Course } from '../course/course';

@Component({
    selector: 'page-courseList',
    templateUrl: 'courseList.html'
})
export class CourseList {
    //try to set the color of the circle dynamically for UI/UX
    color: any = "'#FFFF00'";
    courses: Array<any> = [];

    constructor(public navCtrl: NavController, private http: Http, public toastCtrl: ToastController) {
        this.loadCourses();
    }

    courseClick(event, id: string) {
        this.navCtrl.push(Course, { 'id': id });
        console.log(typeof event);
        console.log(JSON.stringify(event));
    }

    onHold(event) {
        let toast = this.toastCtrl.create({
            message: 'find something to do here',
            duration: 3000
        });
        console.log(typeof event);
        console.log(JSON.stringify(event));

        toast.present();
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
            size: 3,
            offset: offset,
            orders: ['id']
        };

        this.http.post('https://edulab-1377.appspot.com/_ah/api/list', JSON.stringify(data), { headers: headers }).subscribe(res => {
            console.log("success");
            console.log(JSON.stringify(res.json()));
            if (res.json() != null) {
                this.courses = this.courses.concat(res.json());
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

    favourite(event) {
        console.log('favs');
        console.log(typeof event);
        console.log(JSON.stringify(event));
        event.stopPropagation();
    }

    /**
     * @method placeholder to enable the on click and press animation
     */
    placeholder() { }
}
