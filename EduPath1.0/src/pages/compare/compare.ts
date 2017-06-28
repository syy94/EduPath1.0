import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { courseObjLayout } from '../../services/courseobjlayout'
import { Http, Response, ResponseContentType, Headers} from '@angular/http';

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
        for (let i = 0; i < this.courses.length; i++) {
            this.loadCourse(i, this.courses[i].color);
        }
    }

    /**
     * @param id Id of course to be aqquired
     * @param then Function to run regardless of success or error
     * @param error Function to during an error
     * @param success Function to run if successful
     */
    loadCourse(index, color, then?: () => any, error?: (err) => any, success?: (res) => any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let data = {
            id: this.courses[index].id
        };

        this.http.post('https://edulab-1377.appspot.com/_ah/api/course', JSON.stringify(data), { headers: headers }).subscribe(res => {
            let course: courseObjLayout = res.json();
            course["color"] = color;
            course.ext_info = this.sample;

            this.courses[index] = course;

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
    sample: Object = {
        "1:General": {
            "Modules": ["A113 Mathematics",
                "A114 Mathematics II",
                "A107 Physics",
                "A201 Chemistry",
                "B102 Organisational Behaviour",
                "G101 Cognitive Processes and Problem Solving",
                "G107 Effective Communication",
                "G905 Life Skills",
                "Freely Chosen Module (4 MC )"],
            "Programs": []
        },
        "2:Discipline": ["A104 Biology",
            "A202 Chemistry II",
            "A203 Applied Physics",
            "A301 Laboratory Management",
            "A364 Analytical Instrumentation"],
        "3:Specialisation": {
            "Advanced Materials Track": ["A291 Materials Science",
                "A292 Polymer and Composite Science",
                "A333 Nanotechnology",
                "A345 Biomaterials",
                "A391 Materials Processing",
                "A392 Advanced Materials",
                "A395 Composite Materials Design and Applications",
                "A394 Materials Analysis",
                "A396 Additive Manufacturing for Applied Materials"],
            "Biomedical Materials Track": ["A222 Molecular and Cell Biology",
                "A291 Materials Science",
                "A292 Polymer and Composite Science",
                "A341 Stem Cell and Tissue Engineering",
                "A342 Biosensor Technology and Biomedical Devices",
                "A345 Biomaterials",
                "A391 Materials Processing",
                "A392 Advanced Materials",
                "A394 Materials Analysis"],
            "Elective (Select One)": ["A103 Anatomy and Physiology",
                "A333 Nanotechnology",
                "A342 Biosensor Technology and Biomedical Devices",
                "E341 Electronic and Semiconductor Materials"]
        }
    };
}