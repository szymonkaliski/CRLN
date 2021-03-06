precision highp float;

uniform sampler2D orgPositions;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec3 currentPos = texture2D(texturePositions, uv).xyz;
  vec3 orgPos = texture2D(orgPositions, uv).xyz;
  vec3 currentVel = texture2D(textureVelocities, uv).xyz;

  vec3 newPos = currentPos + currentVel;

  vec3 center = vec3(0.0);

  if (distance(newPos, center) < 220.0) {
    gl_FragColor = vec4(newPos, 1.0);
  }
  else {
    gl_FragColor = vec4(orgPos, 1.0);
  }
}

