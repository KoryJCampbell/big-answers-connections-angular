import { Node } from './node';

export class Link implements d3.SimulationLinkDatum<Node> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  // index?: number;

  index:number;

  // must - defining enforced implementation properties
  source: Node | string | number | any;
  target: Node | string | number | any;

  constructor(source, target, index) {
    this.source = source;
    this.target = target;
    this.index = index;
  }
}
