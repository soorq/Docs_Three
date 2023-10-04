import { IResResize } from "../types";

export const isResize = ({
  renderer,
  canvas,
  width,
  height,
  updateStyle = false,
}: IResResize): boolean => {
  const isResizing = canvas.width !== width || canvas.height !== height;

  if (isResizing) {
    renderer.setSize(width, height, updateStyle);
  }

  return isResizing;
};
