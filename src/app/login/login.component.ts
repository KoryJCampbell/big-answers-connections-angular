import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  files: File[] = [];

  connections: any[] = [];
  header = true;
  nodes: any[] = [];
  links: any[] = [];


  constructor(
    public router: Router,
    private ngxCsvParser: NgxCsvParser
  ) {}

  ngOnInit(): void {}


  onSelect(event: {
    addedFiles: any;
  }) {
    console.log(event);
    this.files.push(...event.addedFiles);

    console.log(this.files);

    this.ngxCsvParser.parse(this.files[0], {
        header: this.header,
        delimiter: ','
      })
      .pipe().subscribe((result: Array < any > ) => {

        this.connections = result;
        console.log('Connections => ', this.connections);

        this.nodes.push({
          "firstName": "You",
          "lastName": "",
          "name": "You",
          "company": ""
        });

        for (const source of this.connections) {
          const sourceName = source["First Name"] + " " + source["Last Name"];

          this.links.push({
            "source": "You",
            "target": sourceName
          });

          this.nodes.push({
            "firstName": source["First Name"],
            "lastName": source["Last Name"],
            "name": sourceName,
            "company": source["Company"]
          });

          for (const target of this.connections) {
            const targetName = target["First Name"] + " " + target["Last Name"];
            if (sourceName != targetName && source["Company"] == target["Company"]) {
              this.links.push({
                "source": sourceName,
                "target": targetName
              });
            }
          }

          const graph = {
            "nodes": this.nodes,
            "links": this.links
          }

          // console.log(graph);

          localStorage.setItem('graph', JSON.stringify(graph));

        }

      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });

    // Navigate to D3 Graph
    this.router.navigateByUrl('/graph');
  }

  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

}
