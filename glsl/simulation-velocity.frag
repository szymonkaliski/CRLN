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

  float posMod = 0.006 + cos(t * 0.000197) * 0.003;
  float steerMod = 1.0;
  vec3 tMod = vec3(0.0, 0.0, t) * 0.00001;

  float d = distance(currentPos, vec3(0.0));

  vec3 curl = curlNoise(currentPos * posMod + tMod);
  vec3 curlSteer = curl * steerMod;

  vec2 rot = rotate(currentPos.xy, (0.5 + -cos(t * 0.00021) * 0.3) * PI);
  vec3 rotSteer = vec3(rot.x, rot.y, 0.0);

  vec3 newVel = mix(
    currentVel,
    mix(curlSteer, rotSteer, 0.001 + (-sin(t * 0.000000018) * 0.01 + 0.01)),
    0.8
  );

  float limit = 0.5 + cos(t * 0.00013) * 0.4;

  if (length(newVel) > limit) {
    newVel = normalize(newVel) * limit;
  }

  gl_FragColor = vec4(newVel, 1.0);
}

