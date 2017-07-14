import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';
import { courseObjLayout } from '../../services/courseobjlayout'

@Component({
    selector: 'popover-courseMenu',
    templateUrl: 'courseMenu.html'
})
export class CourseMenu {
    courses: Array<courseObjLayout> = [];

    constructor(public viewCtrl: ViewController, private navParam: NavParams) {       
        this.courses = navParam.get("courses");
    }

    selectType(event, course_id) {
        this.viewCtrl.dismiss(course_id);
    }
}