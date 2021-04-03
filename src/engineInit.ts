import Engine from './engine';
import StockNodeTypeDeclarations from './stockNodeTypeDeclarations';

/**
 * Generate a new engine that includes type declarations.
 *
 * @return  New Engine instance.
 */
export default function createEngine(): Engine {
  const e = new Engine();
  e.nodeTypeDefinitions = StockNodeTypeDeclarations;
  return e;
}
