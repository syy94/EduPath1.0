import { Http, Response, ResponseContentType, Headers} from '@angular/http';

import { courseObjLayout } from "../services/courseobjlayout";

let headers = new Headers();
headers.append('Content-Type', 'application/json');

let colorMap = new Map<string, any>();

function addColor(courses: Array<courseObjLayout>): Array<any> {
    for (let course of courses) {
        if (colorMap.has(course.id)) {
            course["color"] = colorMap.get(course.id);
        } else {
            course["color"] = "hsl(" + randomInt(0, 360) + "," + randomInt(70, 100) + "%,"
                + randomInt(40, 90) + "%)";
            colorMap.set(course.id, course.color);
        }
    }
    return courses;
}

function randomInt(min:number , max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export class LoadCourses {
    /*
        Sample response:
            [{"score": "21", "name": "3D Interactive Media Technology", "poly": "TP"}]
        Array of 1 course
        */

    private data: Object;

    constructor(private http: Http, sort = 'Course ID', offset = 0) {
        this.data = {
            size: 20,
            offset: offset
        };

        //TODO Find a better way to do this. Enums?
        this.setSort(sort);
    }

    public setSize(size: Number): LoadCourses {
        this.data['size'] = size;
        return this;
    }

    public setOffset(offset: Number): LoadCourses {
        this.data['offset'] = offset;
        return this;
    }

    public setSchool(school: string): LoadCourses {
        this.data['school'] = school;
        return this;
    }

    public setSort(sort: String): LoadCourses {
        switch (sort) {
            case 'Course ID':
                this.data['orders'] = ['id'];
                break;
            case 'Polytechnic':
                this.data['orders'] = ['poly', 'name'];
                break;
            case 'Score':
                this.data['orders'] = ['score', 'name'];
                break;
        }
        return this;
    }

    public getCourses(success: (res) => any, error?: (err) => any) {
        this.http.post('https://edulab-1377.appspot.com/_ah/api/list', JSON.stringify(this.data), { headers: headers }).subscribe(res => {
            if (res.json() != null) {
                let result = addColor(res.json());
                success(result);
            } else {
                error("Empty response");
            }
        }, err => {
            error(err);
        });
    }
}

export class SearchCourses {
    task_id: number = 0;

    constructor(private http: Http) { }

    /**
     * Returns a task id for users to verify if the callback is the latest.
     *
     * @param stringkey space separated string of keywords
     * @param success callback if successful
     * @param error Optional callback to handle errors
     * 
     */
    key(search_key: string, offset: number, success: (res, task_id) => any, error?: (err) => any) {
        let result_id = this.task_id;
        this.task_id++;

        this.http.post('https://edulab-1377.appspot.com/_ah/api/search', JSON.stringify({ "query": search_key, "offset": offset }), { headers: headers }).subscribe(res => {
            if (res.json() != null) {
                let result = addColor(res.json());
                success(result, result_id);
            } else {
                error("Empty response");
            }
        }, err => {
            error(err);
        });
        return result_id;
    }
}

export class FavService {
    constructor(private http: Http) { }

    get(id_list, success: (res) => any, error?: (err) => any) {
        this.http.post('https://edulab-1377.appspot.com/_ah/api/favs', JSON.stringify(id_list), { headers: headers }).subscribe(res => {
            if (res.json() != null) {
                let result = addColor(res.json());
                success(result);
            } else {
                error("Empty response");
            }
        }, err => {
            error(err);
        });
    }
}

export class CourseService {
    constructor(private http: Http) { }

    get(id: string, success: (res) => any, error?: (err) => any) {
        this.http.post("https://edulab-1377.appspot.com/_ah/api/course", JSON.stringify({ id: id }), { headers: headers }).subscribe(res => {
            let result: courseObjLayout = res.json();
            result.color = colorMap.get(result.id);
            if (result.structure != "") {
                result.structure = JSON.parse(result.structure.toString());
            }
            success(result);

        }, err => {
            if (error != null) {
                error(err);
            }
            console.log("fail");
            console.log(JSON.stringify(err));
        });

        /*
        Sample response:
        {
            "year": "2017",
            "url": "http://www.nyp.edu.sg/schools/sdn/full-time-courses/sustainable-architectural-design.html",
            "name": "Sustainable Architectural Design",
            "id": "C38",
            "cluster": "BUILT ENVIRONMENT",
            "poly": "NYP",
            "score": 19,
            "description": "This course......<br />", //text
            "intake": "0",
            "url2": "",
            "structure": "{\"3:Year 2......}" //JSON Object
        }
        */
    }
}