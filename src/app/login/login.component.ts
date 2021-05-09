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

  parsePromise(file) {
    console.log(file);
    let self = this;
    return new Promise(function(complete, error) {
      self.papa.parse(file, {complete, error, header: true});
    });
  };

  ngOnInit(): void {}

  getKey(node) {
    return `${node["First Name"]} ${node["Last Name"]}`
  }

  createNodeFromResult(result) {
    const sourceName = result["First Name"] + " " + result["Last Name"];
    if(sourceName === " ") {
      return null;
    }

    let node = {
      "firstName": result["First Name"],
      "lastName": result["Last Name"],
      "name": sourceName,
      "isUser": false,
      "company": result["Company"],
      "position": result["Position"],
      "connections": {},
    }

    return node;
  }

  onSelect(event: {
    addedFiles: any;
  }) {
    this.files.push(...event.addedFiles);

    console.log(event);
    localStorage.clear;

    //[TODO] Papa Parse Must Parse Indiduvual File object then on LoadGraph() Add User Object -> Indiuvual Node
    // let allResults = [];

    const graph = {
      "nodes": [],
      "links": [],
    }

    var self = this;
    let file_promises = []
    for (let i = 0; i < this.files.length; i++) {

      let promise = self.parsePromise(self.files[i]).then((results:any) => {
          // console.log("Parsing data from file", i)
          let node = {
            "firstName": "User: " + i,
            "lastName": "Last",
            "name": "User: " + i,
            "company": "",
            "isUser": true,
            "connections": {},
          }

          let connections = []
          results.data.forEach((result) => {

            let connection = {...result}
            let id = self.getKey(result)


            connection[id] = result
            connections[id] = connection;

            graph.nodes.forEach((existing_node) => {
              //check if this connection's id already exists in other nodes
              if(existing_node.connections[id] !== undefined) {
                // console.log("we have a match", connection, self.createNodeFromResult(connection))
                if(self.createNodeFromResult(connection)) {
                  let connectionNode = self.createNodeFromResult(connection)
                  graph.nodes.push(connectionNode)
                  graph.links.push({
                    source: node.name,
                    target: connectionNode.name
                  })

                  graph.links.push({
                    source: existing_node.name,
                    target: connectionNode.name
                  })
                }

              }
            })
          })

          node.connections = connections;

          // console.log("finished building node", node.connections)

          graph.nodes.push(node)
        })

        file_promises.push(promise);
    }


    Promise.all(file_promises).then(() => {
      localStorage.setItem('graph', JSON.stringify(graph));
    })

  }


clickButton() {
    this.router.navigateByUrl('/graph');

}


  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}

