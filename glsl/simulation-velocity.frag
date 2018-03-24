// calculates new velocity

#pragma glslify: curlNoise = require(glsl-curl-noise)

// varying vec2 uv;

// uniform float time;

// uniform sampler2D texturePositions;
// uniform sampler2D textureVelocities;
// uniform vec2 mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 currentPos = texture2D(texturePositions, uv).xyz;
  vec3 currentVel = texture2D(textureVelocities, uv).xyz;

  float curlMod  = 0.015;
  float steerMod = 0.1;
  // float timeMod  = 0.2;
  // float time     = 0.2;

  vec3 curl = curlNoise(currentPos * curlMod);
  vec3 steer = curl * steerMod;

  // float dist = length(vec2(currentPos.x, currentPos.y) / 512.0 - mouse) * 1.0;
  // steer = mix(steer, vec3(mouse, 0.0), (1.0 / dist) * 0.04);

  vec3 newVel = currentVel + steer;

  float limit = 0.8;

  if (length(newVel) > limit) {
    newVel = normalize(newVel) * limit;
  }

  // vec3 newVel = normalize(currentVel + steer);
  // vec3 newVel = normalize(currentVel) + steer;

  gl_FragColor = vec4(newVel, 1.0);
  // gl_FragColor = vec4(vec3(0.0), 1.0);
}

