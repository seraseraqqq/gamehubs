/* Original procedural 3D fur: shaded sphere and 5,200 curved filaments.
 * No downloaded model, texture, framework or runtime network request. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  function create(canvas) {
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) return null;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, `
      attribute vec3 position; attribute vec3 normal; attribute float fiber;
      uniform float angle; uniform float tilt; uniform float bounce;
      varying vec3 n; varying vec3 p; varying float f;
      void main(){
        mat3 rz=mat3(cos(angle),sin(angle),0.,-sin(angle),cos(angle),0.,0.,0.,1.);
        mat3 ry=mat3(cos(tilt),0.,-sin(tilt),0.,1.,0.,sin(tilt),0.,cos(tilt));
        p=rz*ry*position; n=normalize(rz*ry*normal); f=fiber;
        float perspective=1.+p.z*.09;
        gl_Position=vec4(p.x*.86*perspective*(1.+bounce*.035),p.y*.86*perspective*(1.-bounce*.04),-p.z*.6,1.);
      }`));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, `
      precision mediump float; varying vec3 n; varying vec3 p; varying float f;
      void main(){
        vec3 light=normalize(vec3(-.65,.8,1.));
        float diffuse=max(0.,dot(n,light));
        float rim=pow(1.-max(n.z,0.),2.);
        vec3 base=mix(vec3(.85,.43,.32),vec3(1.,.78,.61),.30+diffuse*.70);
        base+=rim*vec3(.045,.025,.012)+f*.012;
        gl_FragColor=vec4(base,1.);
      }`));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const vertices = [];
    function put(p, n, f) { vertices.push(...p, ...n, f); }
    const point = (lat, lon) => [Math.sin(lat)*Math.cos(lon), Math.cos(lat), Math.sin(lat)*Math.sin(lon)];
    for (let y=0;y<40;y++) for(let x=0;x<56;x++) {
      const a=point(y/40*Math.PI,x/56*TAU), b=point((y+1)/40*Math.PI,x/56*TAU);
      const c=point((y+1)/40*Math.PI,(x+1)/56*TAU), d=point(y/40*Math.PI,(x+1)/56*TAU);
      for(const p of [a,b,c,a,c,d]) put(p.map(v=>v*.83),p,0);
    }
    const sphereCount=vertices.length/7;
    let seed=1073;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    for(let i=0;i<5200;i++) {
      const y=1-2*random(), phi=random()*TAU, r=Math.sqrt(1-y*y);
      const n=[Math.cos(phi)*r,y,Math.sin(phi)*r], tangent=[-Math.sin(phi),.12,Math.cos(phi)];
      const length=.012+random()*.027, curl=(random()-.5)*.018;
      let previous=n.map(v=>v*.822);
      for(let j=1;j<=3;j++) {
        const t=j/3, p=n.map((v,k)=>v*(.822+length*t)+tangent[k]*curl*t*t);
        put(previous,n,1);put(p,n,1);previous=p;
      }
    }
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    for(const [name,size,offset] of [['position',3,0],['normal',3,12],['fiber',1,24]]) {
      const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,28,offset);
    }
    const uniforms=Object.fromEntries(['angle','tilt','bounce'].map(k=>[k,gl.getUniformLocation(program,k)]));
    gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
    let lost=false;
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;canvas.hidden=true;canvas.closest('.arena')?.classList.remove('fur-ready');});
    canvas.addEventListener('webglcontextrestored',()=>{canvas.hidden=true;});
    function draw(angle, bounce=0, reduced=false) {
      if(lost)return;
      const size=Math.round(Math.min(2,devicePixelRatio||1)*210);
      if(canvas.width!==size){canvas.width=canvas.height=size;gl.viewport(0,0,size,size);}
      gl.uniform1f(uniforms.angle,-angle);gl.uniform1f(uniforms.tilt,.25);gl.uniform1f(uniforms.bounce,reduced?0:bounce);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES,0,sphereCount);gl.drawArrays(gl.LINES,sphereCount,vertices.length/7-sphereCount);
    }
    draw(0);canvas.hidden=false;return {draw};
  }
  window.CoreballFur={create(canvas){try{return create(canvas);}catch{return null;}}};
})();
