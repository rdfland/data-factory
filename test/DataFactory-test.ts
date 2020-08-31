/* eslint-disable @typescript-eslint/camelcase */
import 'jest-rdf';
import * as RDF from 'rdf-js';
import { DataFactory } from '../lib/DataFactory';

describe('DataFactory', () => {
  let factory: DataFactory;

  beforeEach(() => {
    factory = new DataFactory();
  });

  it('to have correct typings', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const otherFactory: RDF.DataFactory = factory;
  });

  describe('namedNode', () => {
    it('should produce a valid named node', () => {
      const namedNode: RDF.NamedNode = factory.namedNode('ex:a');
      expect(namedNode.termType).toEqual('NamedNode');
      expect(namedNode.value).toEqual('ex:a');
    });

    it('should handle equals', () => {
      const term = factory.namedNode('ex:a');
      expect(term.equals(null)).toEqual(false);
      expect(term.equals(undefined)).toEqual(false);
      expect(term.equals(factory.blankNode())).toEqual(false);
      expect(term.equals(factory.namedNode('ex:a'))).toEqual(true);
    });
  });

  describe('blankNode', () => {
    it('should produce a valid blank node for a given label', () => {
      const blankNode: RDF.BlankNode = factory.blankNode('a');
      expect(blankNode.termType).toEqual('BlankNode');
      expect(blankNode.value).toEqual('a');
    });

    it('should generate a blank node label without a given label', () => {
      expect(factory.blankNode().value).toEqual('df-0');
      expect(factory.blankNode().value).toEqual('df-1');
      expect(factory.blankNode().value).toEqual('df-2');
    });

    it('should generate a blank node label without a given label and consider resets on the factory', () => {
      expect(factory.blankNode().value).toEqual('df-0');
      expect(factory.blankNode().value).toEqual('df-1');
      factory.resetBlankNodeCounter();
      expect(factory.blankNode().value).toEqual('df-0');
      expect(factory.blankNode().value).toEqual('df-1');
    });

    it('should handle equals', () => {
      const term = factory.blankNode('a');
      expect(term.equals(null)).toEqual(false);
      expect(term.equals(undefined)).toEqual(false);
      expect(term.equals(factory.namedNode('a'))).toEqual(false);
      expect(term.equals(factory.blankNode('a'))).toEqual(true);
    });
  });

  describe('literal', () => {
    it('should produce a valid string literal', () => {
      const literal: RDF.Literal = factory.literal('abc');
      expect(literal.termType).toEqual('Literal');
      expect(literal.value).toEqual('abc');
      expect(literal.language).toEqual('');
      expect(literal.datatype).toEqual(factory.namedNode('http://www.w3.org/2001/XMLSchema#string'));
    });

    it('should produce a valid language tagged literal', () => {
      const literal: RDF.Literal = factory.literal('abc', 'en-us');
      expect(literal.termType).toEqual('Literal');
      expect(literal.value).toEqual('abc');
      expect(literal.language).toEqual('en-us');
      expect(literal.datatype).toEqual(factory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString'));
    });

    it('should produce a valid datatyped literal', () => {
      const literal: RDF.Literal = factory.literal('abc', factory.namedNode('ex:dt'));
      expect(literal.termType).toEqual('Literal');
      expect(literal.value).toEqual('abc');
      expect(literal.language).toEqual('');
      expect(literal.datatype).toEqual(factory.namedNode('ex:dt'));
    });

    it('should handle equals', () => {
      const term = factory.literal('a');
      expect(term.equals(null)).toEqual(false);
      expect(term.equals(undefined)).toEqual(false);
      expect(term.equals(factory.blankNode())).toEqual(false);
      expect(term.equals(factory.literal('a'))).toEqual(true);

      expect(factory.literal('a', 'en-us')
        .equals(factory.literal('a', 'en-us'))).toEqual(true);
      expect(factory.literal('a', factory.namedNode('ex:dt'))
        .equals(factory.literal('a', factory.namedNode('ex:dt')))).toEqual(true);

      expect(factory.literal('a')
        .equals(factory.literal('a', 'en-us'))).toEqual(false);
      expect(factory.literal('a')
        .equals(factory.literal('a', factory.namedNode('ex:dt')))).toEqual(false);
      expect(factory.literal('a')
        .equals(factory.literal('a', factory.namedNode('http://www.w3.org/2001/XMLSchema#string')))).toEqual(true);

      expect(factory.literal('a', 'en-us')
        .equals(factory.literal('a'))).toEqual(false);
      expect(factory.literal('a', 'en-us')
        .equals(factory.literal('a', factory.namedNode('ex:dt')))).toEqual(false);
      expect(factory.literal('a', 'en-us')
        .equals(factory.literal('a',
          factory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString')))).toEqual(false);

      expect(factory.literal('a', factory.namedNode('ex:dt'))
        .equals(factory.literal('a'))).toEqual(false);
      expect(factory.literal('a', factory.namedNode('ex:dt1'))
        .equals(factory.literal('a', factory.namedNode('ex:dt2')))).toEqual(false);
      expect(factory.literal('a', factory.namedNode('ex:dt'))
        .equals(factory.literal('a',
          factory.namedNode('http://www.w3.org/2001/XMLSchema#string')))).toEqual(false);
    });
  });

  describe('variable', () => {
    it('should produce a valid variable', () => {
      const variable: RDF.Variable = factory.variable('a');
      expect(variable.termType).toEqual('Variable');
      expect(variable.value).toEqual('a');
    });

    it('should handle equals', () => {
      const term = factory.variable('a');
      expect(term.equals(null)).toEqual(false);
      expect(term.equals(undefined)).toEqual(false);
      expect(term.equals(factory.blankNode())).toEqual(false);
      expect(term.equals(factory.variable('a'))).toEqual(true);
    });
  });

  describe('defaultGraph', () => {
    it('should produce a valid default graph', () => {
      const defaultGraph: RDF.DefaultGraph = factory.defaultGraph();
      expect(defaultGraph.termType).toEqual('DefaultGraph');
      expect(defaultGraph.value).toEqual('');
    });

    it('should produce a singleton', () => {
      expect(factory.defaultGraph()).toBe(factory.defaultGraph());
    });

    it('should handle equals', () => {
      const term = factory.defaultGraph();
      expect(term.equals(null)).toEqual(false);
      expect(term.equals(undefined)).toEqual(false);
      expect(term.equals(factory.blankNode())).toEqual(false);
      expect(term.equals(factory.defaultGraph())).toEqual(true);
    });
  });

  describe('quad', () => {
    it('should produce a valid quad', () => {
      const quad: RDF.Quad = factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.namedNode('ex:o'),
        factory.namedNode('ex:g'),
      );
      expect(quad.termType).toEqual('Quad');
      expect(quad.value).toEqual('');

      const subject: RDF.Quad_Subject = quad.subject;
      const predicate: RDF.Quad_Predicate = quad.predicate;
      const object: RDF.Quad_Object = quad.object;
      const graph: RDF.Quad_Graph = quad.graph;
      expect(subject).toEqualRdfTerm(factory.namedNode('ex:s'));
      expect(predicate).toEqualRdfTerm(factory.namedNode('ex:p'));
      expect(object).toEqualRdfTerm(factory.namedNode('ex:o'));
      expect(graph).toEqualRdfTerm(factory.namedNode('ex:g'));
    });

    it('should produce a valid without a given graph', () => {
      const quad: RDF.Quad = factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.namedNode('ex:o'),
      );
      expect(quad.termType).toEqual('Quad');
      expect(quad.value).toEqual('');

      const subject: RDF.Quad_Subject = quad.subject;
      const predicate: RDF.Quad_Predicate = quad.predicate;
      const object: RDF.Quad_Object = quad.object;
      const graph: RDF.Quad_Graph = quad.graph;
      expect(subject).toEqualRdfTerm(factory.namedNode('ex:s'));
      expect(predicate).toEqualRdfTerm(factory.namedNode('ex:p'));
      expect(object).toEqualRdfTerm(factory.namedNode('ex:o'));
      expect(graph).toEqualRdfTerm(factory.defaultGraph());
    });

    it('should produce a valid nested quad', () => {
      const quad: RDF.Quad = factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.quad(
          factory.namedNode('ex:s_'),
          factory.namedNode('ex:p_'),
          factory.namedNode('ex:o_'),
          factory.namedNode('ex:g_'),
        ),
        factory.namedNode('ex:g'),
      );
      expect(quad.termType).toEqual('Quad');
      expect(quad.value).toEqual('');

      const subject: RDF.Quad_Subject = quad.subject;
      const predicate: RDF.Quad_Predicate = quad.predicate;
      const object: RDF.Quad_Object = quad.object;
      const graph: RDF.Quad_Graph = quad.graph;
      expect(subject).toEqualRdfTerm(factory.namedNode('ex:s'));
      expect(predicate).toEqualRdfTerm(factory.namedNode('ex:p'));
      expect(object).toEqualRdfTerm(factory.quad(
        factory.namedNode('ex:s_'),
        factory.namedNode('ex:p_'),
        factory.namedNode('ex:o_'),
        factory.namedNode('ex:g_'),
      ));
      expect(graph).toEqualRdfTerm(factory.namedNode('ex:g'));
    });

    it('should handle equals', () => {
      const term = factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.namedNode('ex:o'),
        factory.namedNode('ex:g'),
      );
      expect(term.equals(null)).toEqual(false);
      expect(term.equals(undefined)).toEqual(false);
      expect(term.equals(factory.blankNode())).toEqual(false);
      expect(term.equals(factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.namedNode('ex:o'),
        factory.namedNode('ex:g'),
      ))).toEqual(true);

      expect(term.equals(factory.quad(
        factory.namedNode('ex:s-'),
        factory.namedNode('ex:p'),
        factory.namedNode('ex:o'),
        factory.namedNode('ex:g'),
      ))).toEqual(false);

      expect(term.equals(factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p-'),
        factory.namedNode('ex:o'),
        factory.namedNode('ex:g'),
      ))).toEqual(false);

      expect(term.equals(factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.namedNode('ex:o-'),
        factory.namedNode('ex:g'),
      ))).toEqual(false);

      expect(term.equals(factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.namedNode('ex:o'),
        factory.namedNode('ex:g-'),
      ))).toEqual(false);
    });

    it('should handle equals for a nested quad', () => {
      const term = factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.quad(
          factory.namedNode('ex:s_'),
          factory.namedNode('ex:p_'),
          factory.namedNode('ex:o_'),
          factory.namedNode('ex:g_'),
        ),
        factory.namedNode('ex:g'),
      );
      expect(term.equals(null)).toEqual(false);
      expect(term.equals(undefined)).toEqual(false);
      expect(term.equals(factory.blankNode())).toEqual(false);
      expect(term.equals(factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.quad(
          factory.namedNode('ex:s_'),
          factory.namedNode('ex:p_'),
          factory.namedNode('ex:o_'),
          factory.namedNode('ex:g_'),
        ),
        factory.namedNode('ex:g'),
      ))).toEqual(true);
    });
  });

  describe('fromTerm', () => {
    it('should handle a named node', () => {
      const input: RDF.NamedNode = factory.namedNode('ex:a');
      const output: RDF.NamedNode = factory.fromTerm(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).not.toBe(output);
    });

    it('should handle a blank node', () => {
      const input: RDF.BlankNode = factory.blankNode('a');
      const output: RDF.BlankNode = factory.fromTerm(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).not.toBe(output);
    });

    it('should handle a string literal', () => {
      const input: RDF.Literal = factory.literal('a');
      const output: RDF.Literal = factory.fromTerm(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).not.toBe(output);
      expect(input.datatype).toBe(output.datatype);
    });

    it('should handle a language tagged literal', () => {
      const input: RDF.Literal = factory.literal('a', 'en-us');
      const output: RDF.Literal = factory.fromTerm(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).not.toBe(output);
      expect(input.datatype).toBe(output.datatype);
    });

    it('should handle a datatyped literal', () => {
      const datatype = factory.namedNode('ex:dt');
      const input: RDF.Literal = factory.literal('a', datatype);
      const output: RDF.Literal = factory.fromTerm(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).not.toBe(output);
      expect(input.datatype).toEqualRdfTerm(output.datatype);
      expect(input.datatype).not.toBe(output.datatype);
    });

    it('should handle a variable', () => {
      const input: RDF.Variable = factory.variable('a');
      const output: RDF.Variable = factory.fromTerm(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).not.toBe(output);
    });

    it('should handle a default graph', () => {
      const input: RDF.DefaultGraph = factory.defaultGraph();
      const output: RDF.DefaultGraph = factory.fromTerm(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).toBe(output);
    });

    it('should handle a quad', () => {
      const input: RDF.Quad = factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.namedNode('ex:o'),
        factory.namedNode('ex:g'),
      );
      const output: RDF.Quad = factory.fromTerm(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).not.toBe(output);

      expect(input.subject).toEqualRdfTerm(output.subject);
      expect(input.subject).not.toBe(output.subject);
      expect(input.predicate).toEqualRdfTerm(output.predicate);
      expect(input.predicate).not.toBe(output.predicate);
      expect(input.object).toEqualRdfTerm(output.object);
      expect(input.object).not.toBe(output.object);
      expect(input.graph).toEqualRdfTerm(output.graph);
      expect(input.graph).not.toBe(output.graph);
    });

    it('should handle a nested quad', () => {
      const input: RDF.Quad = factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.quad(
          factory.namedNode('ex:s_'),
          factory.namedNode('ex:p_'),
          factory.namedNode('ex:o_'),
          factory.namedNode('ex:g_'),
        ),
        factory.namedNode('ex:g'),
      );
      const output: RDF.Quad = factory.fromTerm(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).not.toBe(output);

      expect(input.subject).toEqualRdfTerm(output.subject);
      expect(input.subject).not.toBe(output.subject);
      expect(input.predicate).toEqualRdfTerm(output.predicate);
      expect(input.predicate).not.toBe(output.predicate);
      expect(input.object).toEqualRdfTerm(output.object);
      expect(input.object).not.toBe(output.object);
      expect(input.graph).toEqualRdfTerm(output.graph);
      expect(input.graph).not.toBe(output.graph);

      const inputDeep: RDF.Quad = <RDF.Quad> input.object;
      const outputDeep: RDF.Quad = <RDF.Quad> output.object;
      expect(inputDeep.subject).toEqualRdfTerm(outputDeep.subject);
      expect(inputDeep.subject).not.toBe(outputDeep.subject);
      expect(inputDeep.predicate).toEqualRdfTerm(outputDeep.predicate);
      expect(inputDeep.predicate).not.toBe(outputDeep.predicate);
      expect(inputDeep.object).toEqualRdfTerm(outputDeep.object);
      expect(inputDeep.object).not.toBe(outputDeep.object);
      expect(inputDeep.graph).toEqualRdfTerm(outputDeep.graph);
      expect(inputDeep.graph).not.toBe(outputDeep.graph);
    });
  });

  describe('fromQuad', () => {
    it('should handle a quad', () => {
      const input: RDF.Quad = factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.namedNode('ex:o'),
        factory.namedNode('ex:g'),
      );
      const output: RDF.Quad = factory.fromQuad(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).not.toBe(output);

      expect(input.subject).toEqualRdfTerm(output.subject);
      expect(input.subject).not.toBe(output.subject);
      expect(input.predicate).toEqualRdfTerm(output.predicate);
      expect(input.predicate).not.toBe(output.predicate);
      expect(input.object).toEqualRdfTerm(output.object);
      expect(input.object).not.toBe(output.object);
      expect(input.graph).toEqualRdfTerm(output.graph);
      expect(input.graph).not.toBe(output.graph);
    });

    it('should handle a nested quad', () => {
      const input: RDF.Quad = factory.quad(
        factory.namedNode('ex:s'),
        factory.namedNode('ex:p'),
        factory.quad(
          factory.namedNode('ex:s_'),
          factory.namedNode('ex:p_'),
          factory.namedNode('ex:o_'),
          factory.namedNode('ex:g_'),
        ),
        factory.namedNode('ex:g'),
      );
      const output: RDF.Quad = factory.fromQuad(input);
      expect(input).toEqualRdfTerm(output);
      expect(input).not.toBe(output);

      expect(input.subject).toEqualRdfTerm(output.subject);
      expect(input.subject).not.toBe(output.subject);
      expect(input.predicate).toEqualRdfTerm(output.predicate);
      expect(input.predicate).not.toBe(output.predicate);
      expect(input.object).toEqualRdfTerm(output.object);
      expect(input.object).not.toBe(output.object);
      expect(input.graph).toEqualRdfTerm(output.graph);
      expect(input.graph).not.toBe(output.graph);

      const inputDeep: RDF.Quad = <RDF.Quad> input.object;
      const outputDeep: RDF.Quad = <RDF.Quad> output.object;
      expect(inputDeep.subject).toEqualRdfTerm(outputDeep.subject);
      expect(inputDeep.subject).not.toBe(outputDeep.subject);
      expect(inputDeep.predicate).toEqualRdfTerm(outputDeep.predicate);
      expect(inputDeep.predicate).not.toBe(outputDeep.predicate);
      expect(inputDeep.object).toEqualRdfTerm(outputDeep.object);
      expect(inputDeep.object).not.toBe(outputDeep.object);
      expect(inputDeep.graph).toEqualRdfTerm(outputDeep.graph);
      expect(inputDeep.graph).not.toBe(outputDeep.graph);
    });
  });
});
