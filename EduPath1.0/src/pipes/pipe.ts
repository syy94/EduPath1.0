import { courseObjLayout } from "../services/courseobjlayout"
import { Pipe, Injectable } from '@angular/core';

@Pipe({ name: 'objKeys' })
@Injectable()
export class ObjKeysPipe {
    transform(obj: Object, args?: any): any {
        if (obj == null) {
            return;
        }

        return Object.keys(obj).sort();
    }
}

@Pipe({ name: 'removeJsonIndex' })
@Injectable()
export class RemoveJsonIndexPipe {
    transform(val: string, args?: any): string {
        if (val == null) {
            return;
        }

        let result = val.split(":");

        if (result.length > 1) {
            return result[1];
        } else {
            return val;
        }
    }
}

@Pipe({ name: 'filterCourse' })
@Injectable()
export class FilterCoursePipe {
    transform(obj: Array<courseObjLayout>, args: string): any {
        if (obj == null) {
            return;
        }

        if (args == null || args.length < 2) {
            return obj;
        }
        let filter = [];
        console.log(JSON.stringify(obj));
        for (let course of obj) {
            console.log(JSON.stringify(course));
            if (this.compareKey(course.name, args)
                || this.compareKey(course.id, args)
                || this.compareKey(course.poly, args)) {
                filter.push(course);
            }
        }

        return filter;
    }

    private compareKey(string1: string, string2: string): boolean {
        return string1.toLowerCase().includes(string2.toLowerCase());
    }
}