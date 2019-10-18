module.exports =

`
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

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}


void main () {
    //create a holder for position
  vec3 pos = position;   //vec3 pos= position+ uTranslate;// to move the position
    

    float angle = cos(uTranslate.x + uTranslate.y + uTime);
  pos.xy = rotate(pos.xy, angle);
  pos += uTranslate;
    //add time to the x only
    float movingRange=0.05;
    float scale = 0.4;
   // pos.x +=sin(uTime)*movingRange;
   //pos.y += cos(uTime)* movingRange;
     float z = sin(uTranslate.x * scale + uTranslate.y * uTime * scale * 2.0);
     pos.z += z*2.5;//MOVES THEM IN Z
  
    gl_Position = uProjectionMatrix * uViewMatrix*vec4(pos, 1.0) ;// if you put first viewMatrix get another result 

    vec3 color = position/5.0;
    color = color *0.5;
    color= color + 0.5;
    vColor = color;


   // vColor = aColor;
    vUV = aUV;
}`// gl_Position here I do the mathematics with position which is a vec3 attribute to apply the uniform