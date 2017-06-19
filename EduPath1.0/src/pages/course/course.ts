import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { courseObjLayout } from '../../services/courseobjlayout'
import { Http, Response, ResponseContentType, Headers} from '@angular/http';

@Component({
    selector: 'page-course',
    templateUrl: 'course.html'
})
export class Course {
    id: any;
    course: courseObjLayout = {
        name: "fake one",
        url: "http://www.nyp.edu.sg/schools/sdn/full-time-courses/sustainable-architectural-design.html",
        poly: "NYP",
        ext_info: null,
        course_type: "BUILT",
        score: "19",
        year: "2017",
        id: "C38"
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
        // If we navigated to this page, we will have an id available as a nav param
        this.id = navParams.get('id');
        console.log('id is' + this.id);
        this.loadCourse(this.id);
    }

    itemTapped(event, id) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(Course, {
            'id': id
        });
    }
    /**
     * @param id Id of course to be aqquired
     * @param then Function to run regardless of success or error
     * @param error Function to during an error
     * @param success Function to run if successful
     */
    loadCourse(id, then?: () => any, error?: (err) => any, success?: (res) => any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let data = {
            id: id
        };

        this.http.post('https://edulab-1377.appspot.com/_ah/api/course', JSON.stringify(data), { headers: headers }).subscribe(res => {
            console.log("success");
            console.log(JSON.stringify(res.json()));
            this.course = res.json();

            if (then instanceof Function) {
                then();
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
            {"name":"Sustainable Architectural Design",
             "url":"http://www.nyp.edu.sg/schools/sdn/full-time-courses/sustainable-architectural-design.html",
             "poly":"NYP",
             "ext_info":null,
             "course_type":"BUILT ENVIRONMENT",
             "score":"19",
             "year":"2017",
             "id":"C38"
            }
        */
    }
}