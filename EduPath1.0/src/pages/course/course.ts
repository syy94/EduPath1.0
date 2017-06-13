import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { courseObjLayout } from '../../services/courseobjlayout'

@Component({
    selector: 'page-course',
    templateUrl: 'course.html'
})
export class Course {
    id: any;
    course: courseObjLayout = {
        name: "Sustainable Architectural Design",
        url: "http://www.nyp.edu.sg/schools/sdn/full-time-courses/sustainable-architectural-design.html",
        poly: "NYP",
        ext_info: null,
        course_type: "BUILT ENVIRONMENT",
        score: "19",
        year: "2017",
        id: "C38"
    };

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        // If we navigated to this page, we will have an id available as a nav param
        this.id = navParams.get('id');
        console.log('id is' + this.id);
    }

    itemTapped(event, id) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(Course, {
            'id': id
        });
    }
}