#pragma glslify: curlNoise = require(glsl-curl-noise)
#pragma glslify: scale = require(glsl-scale-linear)

uniform float t;

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

  float posMod = 0.01;
  float steerMod = 0.7;
  vec3 tMod = vec3(0.0, 0.0, t) * 0.0001;

  float d = distance(currentPos, vec3(0.0));

  vec3 curl = curlNoise(currentPos * posMod + tMod);
  vec3 steer = curl * steerMod;

  vec2 rot = rotate(currentPos.xy, (0.5 + -cos(t * 0.0002) * 0.1) * PI);

  vec3 circleSteer = vec3(rot.x, rot.y, 0.0);

  vec3 newVel = mix(currentVel, mix(steer, circleSteer, 0.001), 0.5);

  float limit = 0.8;

  if (length(newVel) > limit) {
    newVel = normalize(newVel) * limit;
  }

  gl_FragColor = vec4(newVel, 1.0);
}

