import Phaser from 'phaser';
import { v4 } from 'uuid';
import { angleDifference } from './utils';
import Line from './utils/line';

export default class NavMeshPolygon extends Phaser.Geom.Polygon {
  constructor(points = []) {
    super(points);

    this.centroid = Phaser.Geom.Point.GetCentroid(this.points);
    this.edges = [];
    this.neighbors = [];
    this.portals = [];
    this.uuid = v4();
    this.initialiseEdges();
    this.initialiseRadius();
  }

  /**
   * @method addNeighbor
   */
  addNeighbor(polygon) {
    this.neighbors.push(polygon);
  }

  /**
   * @method addPortalFromEdge
   * @description build a portal from an edge
   * @param {Line} edge
   * @param {Phaser.Math.Vector2} point1
   * @param {Phaser.Math.Vector2} point2
   */
  addPortalFromEdge(edge, point1, point2) {
    const { centroid, portals } = this;
    const edgeStartAngle = Phaser.Math.Angle.BetweenPoints(centroid, edge.start);

    const angleToStart = Phaser.Math.Angle.BetweenPoints(centroid, point1);
    const angleToEnd = Phaser.Math.Angle.BetweenPoints(centroid, point2);

    const d1 = angleDifference(edgeStartAngle, angleToStart);
    const d2 = angleDifference(edgeStartAngle, angleToEnd);

    if (d1 > d2) {
      portals.push(new Line(point1.x, point1.y, point2.x, point2.y));
    } else {
      portals.push(new Line(point2.x, point2.y, point1.x, point1.y));
    }
  }

  /**
   * @method distanceTo
   * @param {NavMeshPolygon} polygon
   * @return {Number}
   */
  distanceTo(polygon) {
    return Phaser.Math.Distance.BetweenPoints(this.centroid, polygon.centroid);
  }

  /**
   * @method initialiseEdges
   * @description Loop through Polygon points and calculate 'edges' (ie, Lines connecting each vertex)
   */
  initialiseEdges() {
    const { points } = this;
    const length = points.length;
    let i = 0;
    let j;

    for (i; i < length; i++) {
      j = i;

      for (j; j < length; j++) {
        if (i !== j) {
          this.edges.push(new Line(points[i].x, points[i].y, points[j].x, points[j].y));
        }
      }
    }
  }

  /**
   * @method initialiseRadius
   */
  initialiseRadius() {
    const { centroid, points } = this;
    const length = points.length;
    let boundingRadius = 0;
    let point;
    let i = 0;
    let d;

    for (i; i < length; i++) {
      point = points[i];
      d = Phaser.Math.Distance.BetweenPoints(centroid, point);
      if (d > boundingRadius) {
        boundingRadius = d;
      }
    }
    this.boundsRadius = d;
  }
}
