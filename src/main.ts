import "./style.css";

const root = document.querySelector<HTMLDivElement>("#app")!;

root.innerHTML = `
  <div class="wrapper">
    <div class="canvas-animate">
       <canvas class="canvas-rend"></canvas>
    </div>
  
  </div>
`;
