// calculates new position

// varying vec2 uv;

// uniform sampler2D texturePositions;
// uniform sampler2D textureVelocities;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 currentPos = texture2D(texturePositions, uv).xyz;
  vec3 currentVel = texture2D(textureVelocities, uv).xyz;

  vec3 newPos = currentPos + currentVel;

  vec3 center = vec3(0.0);

  if (distance(newPos, center) < 400.0) {
    gl_FragColor = vec4(newPos, 1.0);
  }
  else {
    gl_FragColor = vec4(center, 1.0);
  }
}

