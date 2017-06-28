import { Component } from "@angular/core";

import { NavController, NavParams } from "ionic-angular";
import { Http, Headers} from "@angular/http";
import { courseObjLayout } from "../../services/courseobjlayout";

@Component({
    selector: "page-course",
    templateUrl: "course.html"
})
export class Course {
    course: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
        // if we navigated to this page, we will have an id available as a nav param
        this.course = navParams.get("course");
        this.loadCourse(this.course.id, this.course.color);
    }
    /**
    * @param id Id of course to be aqquired
    * @param then Function to run regardless of success or error
    * @param error Function to during an error
    * @param success Function to run if successful
    */
    loadCourse(id: string, color: string, then?: () => any, error?: (err) => any, success?: (res) => any) {
        let headers: Headers = new Headers();
        headers.append("Content-Type", "application/json");

        let data = {
            id: id
        };

        this.http.post("https://edulab-1377.appspot.com/_ah/api/course", JSON.stringify(data), { headers: headers }).subscribe(res => {
            let result: courseObjLayout = res.json();
            result.color = color;
            result.ext_info = this.sample;
            this.course = result;

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
        "Core": {
            "1:Year 1": ["Effective Communication",
                "Scientific Communication",
                "Leadership: Essential Attributes & Practice 1 (LEAP 1)",
                "Leadership: Essential Attributes & Practice 2 (LEAP 2)",
                "Leadership: Essential Attributes & Practice 3 (LEAP 3)",
                "Cell Biology",
                "Biomolecules",
                "Human Anatomy and Physiology",
                "Organic Chemistry 1",
                "Principles of Inorganic and Physical Chemistry 1",
                "Mathematics for Applied Science",
                "Statistics for Applied Science",
                "Applied Human Physiology",
                "Basic Microbiology"
            ],
            "2:Year 2": ["Career Communication",
                "Biostatistics",
                "Fundamentals of Pathology",
                "Immunology",
                "Analytical Biochemistry",
                "Molecular Genetics",
                "Plant Cell Technology",
                "Molecular Biology",
                "Metabolic Biochemistry",
                "Mammalian Cell Technology",
                "Applied Microbiology"
            ],
            "3:Year 3": ["Student Internship Programme", "Major Project"]
        },
        "Electives": {
            "BioEnterprise": ["BioEnterprise Communications",
                "Contemporary Issues in BioEnterprise Operation",
                "Life Science Industry Funding and Regulations"
            ],
            "Bioinformatics": ["Sequence Analysis",
                "Structural Bioinformatics",
                "Scripting in Bioinformatics"
            ],
            "Forensics and Bioanalytics": ["Forensic Biological, Chemical And Physical Analysis",
                "Forensic Toxicology",
                "Biosafety "
            ],
            "Free Electives": ["Basic Pharmacology",
                "Drug Development and Clinical Trials"
            ],
            "Translational Biomedical Research": ["Molecular Diagnostic Development",
                "OMICs and Recombinant Technology",
                "Stem Cells and Tissue Engineering"
            ]
        }
    };
}