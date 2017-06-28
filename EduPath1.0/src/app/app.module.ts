/// <reference path="../pages/course/course.component.ts" />
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { CourseList } from '../pages/courselist/courselist';
import { Course } from '../pages/course/course';
import { Compare } from '../pages/compare/compare';
import { AppPreferences } from '@ionic-native/app-preferences';
import { SortMenu } from '../popovers/sortmenu/sortmenu';
import { SQLite } from '@ionic-native/sqlite';
import { ObjKeysPipe, RemoveJsonIndexPipe } from "../pipes/pipe";
import { CourseItem } from "../pages/course/course.component.ts";


@NgModule({
    declarations: [
        MyApp,
        CourseList,
        Course,
        Compare,
        SortMenu,
        ObjKeysPipe,
        RemoveJsonIndexPipe,
        CourseItem
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        CourseList,
        Course,
        Compare,
        SortMenu
    ],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        AppPreferences,
        SQLite
    ]
})
export class AppModule { }
