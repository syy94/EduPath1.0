import { Component } from '@angular/core';

import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { Http, Response, ResponseContentType, Headers} from '@angular/http';

import { courseObjLayout } from '../../services/courseobjlayout'
import { CourseService } from "../../services/service"

import { CourseMenu } from '../../popovers/coursemenu/coursemenu';

@Component({
    selector: 'page-multi-compare',
    templateUrl: 'multicompare.html'
})
export class MultiCompare {
    id: any;
    courses: Array<courseObjLayout> = [];

    //top is [0], bot is [1]
    shown_id: Array<string> = [];
    topIndex: number = 0;
    botIndex: number = 1;


    courseMap: Map<string, courseObjLayout> = new Map<string, courseObjLayout>();

    private courseService: CourseService;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
        private popoverCtrl: PopoverController
    ) {
        // If we navigated to this page, we will have an id available as a nav param
        this.courses = navParams.get('courses');

        let topCourse = this.courses[this.topIndex];
        let botCourse = this.courses[this.botIndex];

        this.insertCourseToMap(topCourse);
        this.insertCourseToMap(botCourse);

        this.shown_id.push(topCourse.id);
        this.shown_id.push(botCourse.id);

        this.courseService = new CourseService(http);
        this.loadCourse(this.courses[0]);
        this.loadCourse(this.courses[1]);
    }

    left(event, i) {
        let index: number;
        switch (i) {
            case 0: //top course
                this.topIndex--;
                if (this.topIndex < 0) {
                    this.topIndex = this.courses.length - 1;
                }
                if (this.topIndex == this.botIndex) {
                    this.left(event, i);
                    return;
                }
                index = this.topIndex;
                break;
            case 1: //bot course
                this.botIndex--;
                if (this.botIndex < 0) {
                    this.botIndex = this.courses.length - 1;
                }
                if (this.topIndex == this.botIndex) {
                    this.left(event, i);
                    return;
                }
                index = this.botIndex;
                break;
        }

        this.replaceCourse(i, this.courses[index]);
    }

    right(event, i) {
        let index: number;
        let length = this.courses.length;
        switch (i) {
            case 0: //top course
                this.topIndex = (this.topIndex + 1) % length;
                if (this.topIndex == this.botIndex) {
                    this.right(event, i);
                    return;
                }
                index = this.topIndex;
                break;
            case 1: //bot course
                this.botIndex = (this.botIndex + 1) % length;
                if (this.botIndex == this.topIndex) {
                    this.right(event, i);
                    return;
                }
                index = this.botIndex;
                break;
        }
     
        this.replaceCourse(i, this.courses[index]);
    }

    selector(event, i) {
        let popover = this.popoverCtrl.create(CourseMenu, { courses: this.courses });
        popover.present({
            ev: event
        });

        popover.onDidDismiss((popoverData) => {
            if (popoverData) {
                this.replaceCourse(i, popoverData);
                if (i == 0) {
                    this.topIndex = this.courses.indexOf(popoverData);
                } else {
                    this.botIndex = this.courses.indexOf(popoverData);
                }
            }
        });
    }

    /**
     * Helper method for inserting values in map
     * @param courses
     */
    insertCourseToMap(...courses: Array<courseObjLayout>) {
        for (let course of courses) {
            this.courseMap.set(course.id, course);
        }
    }

    /**
     * 
     * @param pos 0 for top course, 1 for bottom
     * @param course The course to replace
     */
    replaceCourse(pos: number, course: courseObjLayout) {
        if (!this.courseMap.get(course.id)) {
            this.insertCourseToMap(course);
        }
        this.shown_id[pos] = course.id;
        this.loadCourse(course);
    }

    loadCourse(course: courseObjLayout) {
        this.courseService.get(course.id, res => {
            this.courseMap.set(course.id, res);
        });
    }
}