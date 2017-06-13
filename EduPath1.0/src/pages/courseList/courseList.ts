import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import { Http, Response, ResponseContentType} from '@angular/http';
import { Course } from '../course/course';

import { hellothere } from '../../services/service'

@Component({
    selector: 'page-courseList',
    templateUrl: 'courseList.html'
})
export class CourseList {
    debug: String;
    courses: Array<any>;

    constructor(public navCtrl: NavController, private http: Http, public toastCtrl: ToastController) {
        let url = 'https://edulab-1377.appspot.com/_ah/api/course';
        let body = "course_id=C38"

        this.http.post(
            url,
            body
        ).subscribe(function (response) {
            console.log(response);
            this.debug = response;
        });

        this.debug = "hahahsd";
        this.courses = [{
                name: "helloasdf",
                poly: "pls work",
                id: "C38"
            },
            {
                name: "helloas",
                poly: "pls workas",
                id: "C38as"
            }
        ];

    }

    courseClick(id: string) {
        this.navCtrl.push(Course, { 'id': id });
        hellothere();
        console.log('hoohaaa' + id);
    }

    onHold() {
        this.courses.push(this.courses[0])
        let toast = this.toastCtrl.create({
            message: 'User was added successfully',
            duration: 3000
        });
        toast.present();
    }
}
