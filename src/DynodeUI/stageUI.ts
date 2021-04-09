import { VEvent } from '../vanillaEvent';
import SocketUI from './socketUI';

class StageUI {
  svgb: SVGBuilder;

  name = 'Node';

  snapPoints: Array<{x: number, y: number, socket: SocketUI}> = [];

  constructor(container: HTMLElement) {
    this.svgb = new SVGBuilder();
    this.svgb.insert(container);
  }

  addSnapPoint(xp: number, yp: number, socketp: SocketUI): void {
    this.snapPoints.push({ x: xp, y: yp, socket: socketp });
    socketp.addEventListener('move', (e: VEvent) => {
      const sp = this.snapPoints.find((point) => point.socket === socketp);
      const details = e.detail as {x: number, y: number};
      if (sp) {
        sp.x = details.x;
        sp.y = details.y;
      }
    });
  }
  // removeSnapPoint(): void {
  //
  // }
}

export default StageUI;
