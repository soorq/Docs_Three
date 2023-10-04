export interface IResResize {
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  updateStyle?: boolean;
}

export interface IResAnim {
  alepsedTime: number;
  rendered: IResResize;
  camera: THREE.PerspectiveCamera;
  element: THREE.Mesh;
}
