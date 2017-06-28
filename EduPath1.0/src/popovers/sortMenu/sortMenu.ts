import { Component } from '@angular/core';

import { ViewController } from 'ionic-angular';

@Component({
    selector: 'popover-sortMenu',
    templateUrl: 'sortMenu.html'
})
export class SortMenu {
    sortTypes: Array<any> = [
        {
            name: 'Course ID',
            data: ['id']
        }, {
            name: 'Polytechnic',
            data: ['poly', 'name']
        }, {
            name: 'Score',
            data: ['score']
        }
    ];

    constructor(public viewCtrl: ViewController) {
    }

    selectType(event, sortData) {
        this.viewCtrl.dismiss(sortData);
    }
}