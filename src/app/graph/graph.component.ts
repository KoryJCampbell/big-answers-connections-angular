import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {Node} from '../d3/models/node';
import {Link} from '../d3/models/link';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  constructor() {}

  numOfConnections: any;
  filters: string[];
  filterlinks: Array < any > = new Array();
  filterNodes: Array < any > = new Array();

  ngOnInit() {
    const retrievedObject = localStorage.getItem('graph');
    const graph = JSON.parse(retrievedObject);
    this.numOfConnections = graph.nodes;
    this.filters = [];
    this.loadForceDirectedGraph(graph.nodes, graph.links);

  }

  userClick(e, user: string) {
    const retrievedObject = localStorage.getItem('graph');
    const graph = JSON.parse(retrievedObject);

    if (e.checked) {
      const _filterNodes = graph.nodes.filter(x => x.name == user)
      this.filterNodes = this.filterNodes.concat(_filterNodes)
    } else {
      this.filterNodes = this.filterNodes.filter(x => x.name != user)
    }

    if (this.filterNodes.length == 0) {
      this.loadForceDirectedGraph(graph.nodes, graph.links);
    } else {
      this.loadForceDirectedGraph(this.filterNodes, graph.links);
    }


  }

  loadForceDirectedGraph(nodes: Node[], links: Link[]) {
    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const color = d3.scaleOrdinal(d3.schemeBlues[9]);


    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: Node) => d.name)) // the id of the node
      .force("charge", d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));


    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-width', d => Math.sqrt(d.index))
      .attr('stroke', 'black');

    const user_icon_path = "M255,0C114.75,0,0,114.75,0,255s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z M255,76.5c43.35,0,76.5,33.15,76.5,76.5s-33.15,76.5-76.5,76.5c-43.35,0-76.5-33.15-76.5-76.5S211.65,76.5,255,76.5z M255,438.6c-63.75,0-119.85-33.149-153-81.6c0-51,102-79.05,153-79.05S408,306,408,357C374.85,405.45,318.75,438.6,255,438.6z"

    const user_nodes = nodes.filter(node => node.isUser);
    const connection_nodes = nodes.filter(node => !node.isUser)

    const user_node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g.user_node')
      .data(user_nodes)
      .enter()
      .append('g')
      .classed('user_node', true)

    user_node.append('circle')
      .attr('r', 5)
      .attr('fill', 'black')

    user_node.append('path')
      .attr('d', user_icon_path)
      .attr('transform', 'scale(0.025)')
      .attr('transform-origin', "-7px -7px")
      .attr("fill", function (d) {
        return color(d.company);
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
      );




    const connection_node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(connection_nodes)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr("fill", function (d) {
        return color(d.company);
      })
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
      );

    user_node.append('text')
      .text((d) => d.company)
      .attr('x', 6)
      .attr('y', 3);


    user_node.append('title').text((d) => d.name);

    simulation
      .nodes(nodes)
      .on('tick', ticked);

    simulation.force < d3.ForceLink < any, any >> ('link')
      .links(links);

    function ticked() {
      user_node
        .attr('transform', d => `translate(${d.x}, ${d.y})`)

      connection_node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    }



    function dragStarted(event) {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragEnded(event) {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }

}
