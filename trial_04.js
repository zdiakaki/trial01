const regl = require('regl')()
 const glm = require('gl-matrix')

 console.log('here')
 const strVertex = require('./shaders/shaderVertex.js')// call vertex the shaders
 const strFrag = require('./shaders/shaderFrag.js')// call the frag shaders
 console.log('strVertex, strVertex')
 
//var str = `test`;

var mat4 = glm.mat4// create initial matix
var projectionMatrix= mat4.create()
var fov =75* Math.PI/180//transform from radians to degrees
var aspect = window.innerWidth / window.innerHeight

mat4.perspective(projectionMatrix,fov,aspect, 0.01, 1000.00)//mat4.perspective(out,fov,aspect, near, far)//FIELD OF VIEW VERTICAL=FOVY

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix,[0,0,2], [0,0,0],[0,1,0]) //mat4.lookAt(out,eye, center,up)//EYE IF GOES TO 2 IS BIGGER

//console.log(projectionMatrix)//println

var currTime =0.9;



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


var r =Math.sin(currTime)*0.09;
var n =Math.sin(currTime)*0.09;

/*var r = 0.3;
var n = 0.3;*/
const points = [// we should flatten this array
   
    [n, r, 0.0],
    [n, -r, 0.0],
    [-r, -r, 0.0],

    [-r, -r, 0.0],
    [n, r,0.0],
    [-r,r,0.0]

    
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
   
    frag: strFrag,//define the shader you use
    vert: strVertex, //define the shader you use
    
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
    //let cameraX= Math.sin(currTime)
    //let cameraY = Math.sin(currTime)
   // let cameraZ = Math.cos(currTime)
    
    //console.log(cameraX)
    currTime += 0.01
    
    var cameraRadius = 5.0
  var cameraX = Math.sin(currTime) * cameraRadius
  var cameraZ = Math.cos(currTime) * cameraRadius

  mat4.lookAt(viewMatrix, [cameraX, 0, cameraZ], [0, 0, 0], [0, 1, 0])
  //  mat4.lookAt(viewMatrix,[mouseX,mouseY,20], [0,0,0],[0,1,0])//here specify the zoom 
    
   /* const obj = {
        time : currTime,
        view : viewMatrix,
        translate : [1,0,0]// defines the translation with x.y.z
    
    }*/
    
    clear()//clearing the background

    var num = 10
    var start = -num / 2

    for (var i=0 ; i<num ; i++) {
        for (var j=0 ; j<num ; j++){
        
            for (var h=0 ; h<num ; h++){
       
        var obj = {
            time : currTime,
            view : viewMatrix,
            translate: [start + i, start + j, h + start],
           
        }

      drawTriangle(obj)}
    }
    
    }
        /*var obj1 = {
            time : currTime,
            view : viewMatrix,
            translate : [0,0,i*(1.5+Math.sin(currTime *2.00) *0.3)]
        }

        drawTriangle(obj1)*/

     

    window.requestAnimationFrame(render)
}

render()// call the function