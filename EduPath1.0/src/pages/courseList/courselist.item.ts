import { Component, Input } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
@Component({
    selector: 'course-list-item',
    templateUrl: 'courselist.item.html'
})
export class CourseListItem {
    @Input('course') course: any;

    constructor(nav: NavController) {
        //this.model = this.model || new ArticleFeatureModel();
    }
}