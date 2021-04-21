import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Papa } from 'ngx-papaparse';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {
  files: File[] = [];
  connections: any[] = [];
  nodes: any[] = [];
  links: any[] = [];

  constructor(
    public router: Router,
    private papa: Papa
  ) {}

  ngOnInit(): void {}


  onSelect(event: {
    addedFiles: any;
  }) {
    this.files.push(...event.addedFiles);

    localStorage.clear;

    //[TODO] Papa Parse Must Parse Indiduvual File object then on LoadGraph() Add User Object -> Indiuvual Node
    let allResults = [];
    var self = this;
    for (let i = 0; i < this.files.length; i++) {
      this.papa.parse(this.files[i], {
        header: true,
        complete: function (results) {
          allResults.push(results.data);
          if (allResults.length) {
            self.connections = self.connections.concat(allResults[0]);
            loadGraph(self.connections, self.nodes, self.links);

            console.log('finished');
          }
        }
      })
    }
  }


clickButton() {
    this.router.navigateByUrl('/graph');

}



  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }




}


function loadGraph(connections, nodes, links) {

  //let connections = allResults[0];
  //let links = [];
  //let nodes = [];

  nodes.push({
    "firstName": "You",
    "lastName": "",
    "name": "You",
    "company": ""
  });

  for (const source of connections) {
    const sourceName = source["First Name"] + " " + source["Last Name"];

    links.push({
      "source": "You",
      "target": sourceName
    });

    nodes.push({
      "firstName": source["First Name"],
      "lastName": source["Last Name"],
      "name": sourceName,
      "company": source["Company"],
      "position": source["Position"]
    });

    //[TODO]
    // 1. Group Nodes Together by User
    // 2. Compare User Connections by sourceName

    // for (const target of connections) {
    //   const targetName = target["First Name"] + " " + target["Last Name"];
    //   if (sourceName != targetName && source["Company"] == target["Company"]) {
    //     links.push({
    //       "source": sourceName,
    //       "target": targetName
    //     });
    //   }
    // }

    const graph = {
      "nodes": nodes,
      "links": links
    }

    localStorage.setItem('graph', JSON.stringify(graph));

  }
}
