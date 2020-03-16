import { forEach } from '@pixelburp/phaser3-utils';

import Hulls from './hulls';
import NavMeshPolygon from '../navMeshPolygon';
import {areLinesEqual, offsetEdges, sortLine} from '../utils';
import DelaunayCluster from './delaunayCluster';
import Config from '../config';
import Line from '../utils/line';

/**
 * @class DelaunayGenerator
 * @description Helper class to generate the delaunay triangles used in building the NavMesh
 */
export default class DelaunayGenerator {
  constructor() {
    this.points = [];
    this.polygons = [];
  }

  /**
   * @method generatePolygonEdges
   * @description Find all neighbours for each Polygon generated; we assume all are potentially connected given Delaunay
   * @param {NavMeshPolygon[]} polygons
   *
   */
  calculateClusterNeighbours(polygons = []) {
    const polyLength = polygons.length;
    let i = 0;
    let polygon;
    let otherPolygon;

    for (i; i < polyLength; i++) {
      polygon = polygons[i];

      for (let j = i + 1; j < polyLength; j++) {
        otherPolygon = polygons[j];

        for (const edge of polygon.edges) {
          for (const otherEdge of otherPolygon.edges) {

            if (!areLinesEqual(edge, otherEdge)) {
              continue;
            }

            const { start, end } = sortLine(edge);

            polygon.addNeighbor(otherPolygon);
            otherPolygon.addNeighbor(polygon);

            polygon.addPortalFromEdge(edge, start, end);
            otherPolygon.addPortalFromEdge(otherEdge, start, end);
          }
        }
      }
    }
  }

  /**
   * @method generate
   * @description Find (recursively) all outlines of Hulls in the map, and generate Delaunay triangulation from them
   */
  generate() {
    const options = { exterior: false };

    if (this.hulls) {
      this.hulls.generate();
    } else {
      this.hulls = new Hulls();
    }

    this.parseHullClusters();

    /**
     * @method getOffsetChildEdges
     * @param {Cluster} cluster
     * @return {Line[]}
     */
    const getOffsetChildEdges = cluster => {
      const { children } = cluster;
      let edges = [];

      forEach(children, child =>  edges = edges.concat(offsetEdges(child.edges, false, cluster.children)));
      return edges;
    };

    /**
     * @function parseCluster
     * @param {Cluster} cluster
     */
    const parseCluster = cluster => {
      const clusterPolygons = [];

      forEach(cluster.children, child => {
        const parentEdges = cluster.edges;
        const edges = offsetEdges(child.edges, true, child.children);
        const allChildEdges = getOffsetChildEdges(child);
        const { polygons } = new DelaunayCluster(edges, parentEdges, allChildEdges, options);

        forEach(polygons, poly => clusterPolygons.push(new NavMeshPolygon(poly)));

        if (child.children.length) {
          forEach(child.children, parseCluster);
        }
      });

      this.polygons = this.polygons.concat(clusterPolygons);
      this.calculateClusterNeighbours(clusterPolygons);
    };

    forEach(this.hulls.clusters, parseCluster);
  }

  /**
   * @method parseHullClusters
   * @description Create initial triangulation of "root" clusters of hulls
   */
  parseHullClusters() {
    const { hulls } = this;
    const { width, height } = Config.mapDimensions;
    const parentEdges = [
      new Line(0, 0, width, 0),
      new Line(width, 0, width, height),
      new Line(width, height, 0, height),
      new Line(0, height, 0, 0)
    ];
    let edges = [];

    this.polygons = [];
    forEach(hulls.clusters, cluster => edges = edges.concat(offsetEdges(cluster.edges, false, hulls.clusters)));

    const { polygons } = new DelaunayCluster(edges, parentEdges, [], { interior: false });
    forEach(polygons, p => this.polygons.push(new NavMeshPolygon(p)));
    this.calculateClusterNeighbours(this.polygons);
  }
}
