module.exports =

 `
precision mediump float;

varying vec3 vColor;
varying vec2 vUV;
varying float vYPosition;
uniform float uTime;
uniform vec3 uTranslate;

#define PI 3.141592653
const float screenWidth = 14.0;

float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float freq ){
	float unit = screenWidth/freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)));
	float b = rand((ij+vec2(1.,0.)));
	float c = rand((ij+vec2(0.,1.)));
	float d = rand((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res){
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<50; i++){
		n+=amp*noise(p, f);
		f*=2.;
		normK+=amp;
		amp*=persistance;
		if (iCount == res) break;
		iCount++;
	}
	float nf = n/normK;
	return nf*nf*nf*nf;
}


void main(){
    vec2 center = vec2(0.5,0.5);
    vec2 diff =vUV -center;

    diff=normalize(diff);
    float angle= atan(diff.y,diff.x)+ PI;//00~PI
   float noiseValue = noise(vUV*10.0, uTime);///for noise
    //angle = angle;

    float dist = distance (vUV, center);
    //dist= sin(dist*5.0-uTime*5.0);
    gl_FragColor = vec4(vec3(dist),1.0);

    vec3 finalColor = (uTranslate/5.0) * .5 + .5;
    //finalColor = finalColor + dist;
    finalColor = finalColor + sin(vYPosition)*0.2+0.5;
    gl_FragColor = vec4( finalColor, 1.0);
  // gl_FragColor = vec4( vec3(noiseValue),1.0);///for noise
    
}`
