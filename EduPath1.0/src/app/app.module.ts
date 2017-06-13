import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CourseList } from '../pages/courselist/courselist';
import { Course } from '../pages/course/course';
import { Compare } from '../pages/compare/compare';

@NgModule({
    declarations: [
        MyApp,
        CourseList,
        Course,
        Compare
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        CourseList,
        Course,
        Compare
    ],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
