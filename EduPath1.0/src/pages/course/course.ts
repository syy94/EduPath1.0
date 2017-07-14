import { Component } from "@angular/core";

import { NavController, NavParams } from "ionic-angular";
import { Http, Headers} from "@angular/http";
import { CourseService } from "../../services/service.ts"

@Component({
    selector: "page-course",
    templateUrl: "course.html"
})
export class Course {
    course: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
        // if we navigated to this page, we will have an id available as a nav param
        this.course = navParams.get("course");
        new CourseService(http).get(this.course.id, (res) => { this.course = res });
    }
}