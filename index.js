const regl = require('regl')()
 
//var str = `test`;
console.log('Regl, regl')//println

var r = 0.6;
var n = 0.1;
const points = [// we should flatten this array
    [n, r, 0.0],
              [n, -r, 0.0],
              [-r, -r, 0.0]
]

var colors=[
    [0.6,1,0,0.5],
    [0,1,0,1],
    [0,0,0.5,1]
]




var attributes = {
    position:regl.buffer(points),
    aColor: regl.buffer(colors)
}

var vertexShader = `
precision mediump float;
attribute vec3 position;
attribute vec3 aColor;

varying vec3 vColor;

void main () {
    gl_Position = vec4(position, 1.0);

    vColor = aColor;
}`
var fragShader = `
precision mediump float;

varying vec3 vColor;

void main(){
    gl_FragColor = vec4(vColor,1.0);

}`


console.log('Attribute:', attributes)

const drawTriangle = regl(
    {//draw call
    attributes: attributes,
    uniforms: {
        time: regl.prop('time')
    },
    frag:fragShader,
    vert: vertexShader,    
    count:3
    }

)
//console.table(points)
/*
const clear = ()=> {
    regl.clear({
        color: [0,0,0,0]
    })
}
*/

function clear() {// clear the background
    regl.clear({
        color: [0.6,1,0,0.2]//yellow

    })
}


function render() {//name  and define the function-like void draw
    console.log('render')
    currTime += 0.01
    const obj = {time : currTime}
    clear()//clearing the background
    drawTriangle(obj)
    window.requestAnimationFrame(render)
}

render()// call the function