import { ReturnStatement } from '@angular/compiler';
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

  getKey(node) {
    return `${node["First Name"]} ${node["Last Name"]}`
  }

  createNodeFromResult(result) {
    const sourceName = result["First Name"] + " " + result["Last Name"];
    let node = {
      "firstName": result["First Name"],
      "lastName": result["Last Name"],
      "name": sourceName,
      "company": result["Company"],
      "position": result["Position"]

    }
  }

  onSelect(event: {
    addedFiles: any;
  }) {
    this.files.push(...event.addedFiles);

    localStorage.clear;

    //[TODO] Papa Parse Must Parse Indiduvual File object then on LoadGraph() Add User Object -> Indiuvual Node
    let allResults = [];

    //Start with a graph -- right now, this is empty, but in the future, you might load this from local storage
    const graph = {
      "nodes": [],
      "links": [],
    }

    var self = this;
    for (let i = 0; i < this.files.length; i++) {
      this.papa.parse(this.files[i], {
        header: true,
        complete: function (results) {
          let node = {
            "firstName": "You",
            "lastName": "Last",
            "name": "You Last",
            "company": "",
            "connections": [],
          }

          let connections = []
          results.data.forEach((result) => {
            let connection = {...result}
            let id = self.getKey(result)

            connection[id] = result
            connections.push(connection)

            graph.nodes.forEach((existing_node) => {
              //check if this connection's id already exists in other nodes
              if(existing_node.connections[id] !== undefined) {
                graph.nodes.push(self.createNodeFromResult(connection))
                graph.links.push({
                  source: node.name,
                  target: connection.name
                })

                graph.links.push({
                  source: existing_node.name,
                  target: connection.name
                })
              }
            })
          })

          node.connections = connections;

          console.log("finished building node", node)

          graph.nodes.push(node)
        }
      })
    }

    console.log('setting local storage", graph', graph)
    localStorage.setItem('graph', JSON.stringify(graph));

  }


clickButton() {
    this.router.navigateByUrl('/graph');

}



  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}

