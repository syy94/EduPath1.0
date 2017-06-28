import {Component, Input} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import { Http, Headers} from "@angular/http";

import { courseObjLayout } from '../../services/courseobjlayout'

@Component({
    templateUrl: "course.component.html",
    selector: "course-item"
})
export class CourseItem {
    @Input('course') course: courseObjLayout;

    output: string = "";

    private nav: NavController;

    constructor(nav: NavController, public http: Http) {
        this.nav = nav;
        console.log(JSON.stringify(this.course));
        //this.model = this.model || new ArticleFeatureModel();
    }

    isArray(header) {
        console.log(header)
        console.log((this.course.ext_info[header] instanceof Array))
        return (this.course.ext_info[header] instanceof Array);
    }

    isHidden(header, subHeader) {
        if (this.course.ext_info == null) {
            return;
        }

        let headerObj;
        if (subHeader != null) {
            headerObj = this.course.ext_info[header][subHeader];
        } else {
            headerObj = this.course.ext_info[header];
        }

        if (headerObj.hidden == null) {
            //hidden by default
            return true;
        } else {
            return headerObj.hidden;
        }
    }

    toggleHidden(event, header, subHeader) {
        if (this.course.ext_info == null) {
            return;
        }

        let headerObj;
        if (subHeader != null) {
            headerObj = this.course.ext_info[header][subHeader];
        } else {
            headerObj = this.course.ext_info[header];
        }

        if (headerObj.hidden != null) {
            headerObj["hidden"] = !headerObj.hidden;
        } else {
            headerObj["hidden"] = false;
        }
        event.stopPropagation();
    }
}