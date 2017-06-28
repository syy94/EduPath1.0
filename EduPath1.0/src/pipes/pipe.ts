import { Pipe, Injectable } from '@angular/core';

@Pipe({ name: 'objKeys' })
@Injectable()
export class ObjKeysPipe {
    transform(obj: Object, args?: any): any {
        if (obj == null) {
            return;
        }
        return Object.keys(obj);
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