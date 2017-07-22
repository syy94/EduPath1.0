import { UserService } from "./testservice";

import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';
import { SQLite } from '@ionic-native/sqlite';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MyApp } from './app.component';

import { CourseList } from '../pages/courselist/courselist';
import { CourseListItem } from '../pages/courselist/courselist.item';
import { Course } from '../pages/course/course';
import { Compare } from '../pages/compare/compare';
import { CourseItem } from "../pages/course/course.component";
import { FavList } from "../pages/favs/favourites";
import { MultiCompare } from "../pages/multicompare/multicompare";

import { SortMenu } from "../popovers/sortmenu/sortmenu";
import { CourseMenu } from "../popovers/coursemenu/coursemenu";

import { ObjKeysPipe, RemoveJsonIndexPipe, FilterCoursePipe } from "../pipes/pipe";

@NgModule({
    declarations: [
        MyApp,
        CourseList,
        Course,
        Compare,
        MultiCompare,
        FavList,

        SortMenu,
        CourseMenu,

        CourseItem,
        CourseListItem,

        ObjKeysPipe,
        RemoveJsonIndexPipe,
        FilterCoursePipe
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
        SortMenu,
        CourseMenu,
        FavList,
        MultiCompare
    ],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        AppPreferences,
        SQLite,
        InAppBrowser
    ]
})
export class AppModule { }
