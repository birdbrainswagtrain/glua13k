var gl=document.querySelector("canvas").getContext("webgl");
function makeShader(type,src) {
    var shader=gl.createShader(type);
    gl.shaderSource(shader,src);
    gl.compileShader(shader);
    // Debug
    console.log("LOG",gl.getShaderInfoLog(shader));
    return shader;
}

// Shaders
var program = gl.createProgram();
gl.attachShader(program,makeShader(gl.VERTEX_SHADER,"attribute vec4 p;varying vec2 q;void main(){gl_Position=p;q=p.xy;}"));
gl.attachShader(program,makeShader(gl.FRAGMENT_SHADER,"precision mediump float;varying vec2 q;void main(){gl_FragColor = vec4(q.x,q.y,0,1);}"));
gl.linkProgram(program);
gl.useProgram(program);
var attr=gl.getAttribLocation(program,"p");

// Screen Quad
gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,1,1,1,-1,-1,1,-1]),gl.STATIC_DRAW);
gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(attr);

// Draw
gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
