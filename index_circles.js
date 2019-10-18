const regl = require('regl')()
 const glm = require('gl-matrix')
 
//var str = `test`;

var mat4 = glm.mat4// create initial matix
var projectionMatrix= mat4.create()
var fov =75* Math.PI/180//transform from radians to degrees
var aspect = window.innerWidth / window.innerHeight

mat4.perspective(projectionMatrix,fov,aspect, 0.01, 1000.00)//mat4.perspective(out,fov,aspect, near, far)//FIELD OF VIEW VERTICAL=FOVY

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix,[0,0,2], [0,0,0],[0,1,0]) //mat4.lookAt(out,eye, center,up)//EYE IF GOES TO 2 IS BIGGER

//console.log(projectionMatrix)//println

var currTime =0;

var mouseX = 0
var mouseY =0

window.addEventListener('mousemove', function(e)/// e for event-- event handlerer
{
   // console.log('Mouse Move', e.clientX, e.clientY)

    var percentX = e.clientX/window.innerWidth //0~1//map the mouse to 0-1
    var percentY = e.clientY/window.innerHeight //0~1

   // console.log(percentX,percentY)
    percentX = percentX *2 -1 //-1~1
    percentY = percentY *2 -1 //-1~1

    var moveRange =2
    mouseX = percentX * moveRange
    mouseY = percentY * moveRange

})/// write window in console-then event - write the same here


var r = 0.6;
var n = 0.6;
const points = [// we should flatten this array
    [n, r, 5.0],
    [n, -r, 3.0 ],
    [-r, -r, 2.0],

    [-r, -r, 5.0],
    [n, r,3.0],
    [-r,r,2.0]

    
]



var colors=[
    [0.41,0.76,0.39],
    [0.56,0.51,0.90,0.35],
    [0.94,0.61,1,0.39],
    [0.94,0.61,1,0.39],
    [0.41,0.76,0.39],
    [0.94,0.61,1,0.39]
    /*[0,0,1],
    [1,0,0],
    [1,0,1]
    
    
    /*[0.6,1,0,0.5],
    [0,1,0,1],
    [0,0,0.5,1],
    [0,0,0.5,1],
    [0.6,1,0,0.5],
    [0,0,0.5,1],*/
   
]

var uvs = [
    [0,0],
    [1,0],
    [1,1],

    [1,1],
    [0,0],
    [0,1]
]



 attributes = {
    position:regl.buffer(points),
    aColor: regl.buffer(colors),
    aUV :regl.buffer(uvs)
}
  

var vertexShader = `
precision mediump float;
attribute vec3 position;
attribute vec3 aColor;
attribute vec2 aUV;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec3 uTranslate;

varying vec3 vColor;
varying vec2 vUV;

void main () {
    //create a holder for position
    vec3 pos= position+ uTranslate;// to move the position
    
    //add time to the x only
    float movingRange=0.2;
   // pos.x +=sin(uTime)*movingRange;
    //pos.y += cos(uTime)* movingRange;
     float z = sin(uTranslate.x+ uTranslate.y * uTime * 2.0);
     pos.z += z*0.05;
  
    gl_Position = uProjectionMatrix * uViewMatrix*vec4(pos, 1.0) ;// if you put first viewMatrix get another result 

   
     vColor = aColor;
     vUV = aUV;
}`// gl_Position here I do the mathematics with position which is a vec3 attribute to apply the uniform
var fragShader = `
precision mediump float;

varying vec3 vColor;
varying vec2 vUV;

void main(){
    vec2 center = vec2(0.5,0.5);
    float d = distance (vUV, center);

    float gradient = smoothstep(0.48,0.5, d);

    vec4 colorBg = vec4(0.6, 1, 0 ,0.2);
    vec4 colorDot = vec4(0.0, 0.0, 0.0, 0.8);

    // google glsl mix
    vec4 color = mix(colorDot, colorBg, gradient);

    gl_FragColor = color; // gl_FragColor = vec4(vUV,1.0,1.0);
    
}`


//console.log('Attribute:', attributes)

const drawTriangle = regl(/// this is the object in which put attributes-uniforms-shaders etc
{//draw call
    attributes: attributes,
    uniforms: {
        uTime: regl.prop('time'),
        uProjectionMatrix : projectionMatrix,
        uViewMatrix : regl.prop('view'),
        uTranslate : regl.prop('translate')

    },
   
    frag:fragShader,
    vert: vertexShader, 
    
    blend: {
        enable: true,
        func: {
          srcRGB: 'src alpha',
          srcAlpha: 'src alpha',
          dstRGB: 'one minus src alpha',
          dstAlpha: 'one minus src alpha',
        },
      },
    count:6
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
        color: [0.6, 1, 0 ,0.2]//yellow

    })
}


function render() {//name  and define the function-like void draw
    //console.log('render')
    let cameraX= Math.sin(currTime)
    //let cameraY = Math.sin(currTime)
    let cameraZ = Math.cos(currTime)
    
    //console.log(cameraX)
    currTime += 0.01
    mat4.lookAt(viewMatrix,[mouseX,mouseY,20], [0,0,0],[0,1,0])//here specify the zoom 
    
   /* const obj = {
        time : currTime,
        view : viewMatrix,
        translate : [1,0,0]// defines the translation with x.y.z
    
    }*/
    
    clear()//clearing the background


    for (var i=0 ; i<10 ; i++) {
        for (var j=0 ; j<10 ; j++){
            for (var h=0 ; h<3; h++){

       
        var obj = {
            time : currTime,
            view : viewMatrix,
            translate : [j*(1.5+Math.sin(currTime *2.00) *0.3),i*(1.5+Math.sin(currTime *2.00) *0.3),0]//
        }

        drawTriangle(obj)}
    
    }
        /*var obj1 = {
            time : currTime,
            view : viewMatrix,
            translate : [0,0,i*(1.5+Math.sin(currTime *2.00) *0.3)]
        }

        drawTriangle(obj1)*/

     }

    window.requestAnimationFrame(render)
}

render()// call the function