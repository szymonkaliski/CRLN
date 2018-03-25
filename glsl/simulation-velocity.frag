// calculates new velocity

#pragma glslify: curlNoise = require(glsl-curl-noise)

// varying vec2 uv;

uniform float t;

// uniform sampler2D texturePositions;
// uniform sampler2D textureVelocities;
// uniform vec2 mouse;

const float PI = 3.1415926535897932384626433832795;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);

	return m * v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 currentPos = texture2D(texturePositions, uv).xyz;
  vec3 currentVel = texture2D(textureVelocities, uv).xyz;

  float curlMod = 0.03;
  float steerMod = 0.2;

  vec3 tMod = vec3(t) * 0.1;

  vec3 curl = curlNoise((currentPos + tMod) * curlMod);
  vec3 steer = curl * steerMod;

  float d = min(distance(currentPos.xy, vec2(0.0)) / 10.0, 1.0);

  vec2 rot = rotate(currentPos.xy, 0.49 * PI);

  vec3 circleSteer = vec3(rot.x, rot.y, 0.0);

  vec3 newVel = currentVel + mix(steer, circleSteer, 0.01 * d);

  float limit = 1.2;

  if (length(newVel) > limit) {
    newVel = normalize(newVel) * limit;
  }

  // vec3 newVel = normalize(currentVel + steer);
  // vec3 newVel = normalize(currentVel) + steer;

  gl_FragColor = vec4(newVel, 1.0);
  // gl_FragColor = vec4(vec3(0.0), 1.0);
}

