export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  
  firstName: string;
  lastName: string;
  name: string;
  company: string;


  // constructor(id) {
  //   this.id = id;
  // }
}
