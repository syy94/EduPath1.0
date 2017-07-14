import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { courseObjLayout } from '../../services/courseobjlayout'
import { Http, Response, ResponseContentType, Headers} from '@angular/http';
import { CourseService } from "../../services/service.ts"

@Component({
    selector: 'page-compare',
    templateUrl: 'compare.html'
})
export class Compare {
    id: any;
    courses: Array<courseObjLayout> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
        // If we navigated to this page, we will have an id available as a nav param
        this.courses = navParams.get('courses');
        let service = new CourseService(http);
        for (let i = 0; i < this.courses.length; i++) {
            let course = this.courses[i];
            service.get(course.id, res => {
                this.courses[i] = res;
            });
        }
    }
}