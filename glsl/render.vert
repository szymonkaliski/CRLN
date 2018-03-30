uniform sampler2D texturePositions;
varying vec3 vPosition;

void main() {
  vec3 pos = texture2D(texturePositions, position.xy).xyz;

  vPosition = pos;

  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
  gl_PointSize = 1.0;
}
