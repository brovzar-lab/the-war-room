'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { KnowledgeNode, KnowledgeLink } from '@/lib/mock-data';

const NODE_COLORS: Record<KnowledgeNode['type'], string> = {
  deal: '#3B82F6',
  person: '#10B981',
  company: '#F59E0B',
  topic: '#8B5CF6',
  document: '#6B7280',
};

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
  activeNodeId?: string;
  width?: number;
  height?: number;
}

export function KnowledgeGraph({ nodes, links, activeNodeId, width = 800, height = 600 }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    defs.append('filter').attr('id', 'glow')
      .append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');

    const feMerge = defs.select('filter').append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links).id((d: d3.SimulationNodeDatum) => (d as KnowledgeNode).id).distance(80).strength(0.7))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(30));

    const linkSel = g.append('g').selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#3B82F6')
      .attr('stroke-opacity', (d) => d.strength * 0.4)
      .attr('stroke-width', (d) => d.strength * 2);

    const nodeSel = g.append('g').selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, KnowledgeNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            (d as unknown as { fx: number; fy: number }).fx = d3.pointer(event, svgRef.current)[0];
            (d as unknown as { fx: number; fy: number }).fy = d3.pointer(event, svgRef.current)[1];
          })
          .on('drag', (event, d) => {
            (d as unknown as { fx: number; fy: number }).fx = event.x;
            (d as unknown as { fx: number; fy: number }).fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            (d as unknown as { fx: null; fy: null }).fx = null;
            (d as unknown as { fx: null; fy: null }).fy = null;
          })
      );

    nodeSel.append('circle')
      .attr('r', (d) => d.type === 'deal' ? 14 : d.type === 'company' ? 11 : 8)
      .attr('fill', (d) => NODE_COLORS[d.type] + '22')
      .attr('stroke', (d) => NODE_COLORS[d.type])
      .attr('stroke-width', (d) => d.id === activeNodeId ? 2 : 1)
      .attr('filter', (d) => d.id === activeNodeId ? 'url(#glow)' : null);

    nodeSel.append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => (d.type === 'deal' ? 28 : d.type === 'company' ? 24 : 20))
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', '#94A3B8')
      .attr('pointer-events', 'none');

    simulation.on('tick', () => {
      linkSel
        .attr('x1', (d) => (d.source as unknown as { x: number }).x)
        .attr('y1', (d) => (d.source as unknown as { y: number }).y)
        .attr('x2', (d) => (d.target as unknown as { x: number }).x)
        .attr('y2', (d) => (d.target as unknown as { y: number }).y);

      nodeSel.attr('transform', (d) => `translate(${(d as unknown as { x: number }).x},${(d as unknown as { y: number }).y})`);
    });

    return () => { simulation.stop(); };
  }, [nodes, links, activeNodeId, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
}
