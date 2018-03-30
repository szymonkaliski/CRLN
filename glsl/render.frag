#pragma glslify: scale = require(glsl-scale-linear)

varying vec3 vPosition;

void main() {
  float d = distance(vPosition, vec3(0.0));

  float alpha1 = scale(d, vec2(0.0, 150.0), vec2(1.0, 0.0));
  float alpha2 = scale(d, vec2(0.0, 20.0), vec2(0.0, 1.0));
  float alpha = min(alpha1, alpha2);

  // alpha = mix(alpha, 0.0, 5.0 - dist);

  // vec3 color = mix(vec3(1.0), mix(color1, color2, lowFreq), min(dist * 0.008, 1.0));
  // vec3 color = vec3(1., 0., 0.);

  vec3 color = vec3(1.0);

  gl_FragColor = vec4(color, alpha * 0.4);
}
