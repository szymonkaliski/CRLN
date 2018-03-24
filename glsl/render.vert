// float texture containing the positions of each particle

uniform sampler2D texturePositions;
varying vec3 vPosition;

void main() {
  // the mesh is a nomrliazed square so the uvs = the xy positions of the vertices
  vec3 pos = texture2D(texturePositions, position.xy).xyz;
  vPosition = pos;

  // pos now contains the position of a point in space that can be transformed
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(vec3(position.xy, 0.0), 1.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);

  // size
  gl_PointSize = 1.0;
}
