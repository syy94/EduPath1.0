import { Http, Response, ResponseContentType, Headers} from '@angular/http';

let headers = new Headers();
headers.append('Content-Type', 'application/json');



export function hellothere() {
    console.log('it works');
}

export function listCourses(size = 20, offset = 0, order: Array<any>) {
    let data = {
        length: size,
        offset: offset,
        order: order
    };

    return this.http.post('https://edulab-1377.appspot.com/_ah/api/list', JSON.stringify(data), { headers: headers })
        .subscribe(res => {
            console.log("success");
            console.log(JSON.stringify(res.json()));
        }, (err) => {
            console.log("fail");
            console.log(JSON.stringify(err));
        });
}