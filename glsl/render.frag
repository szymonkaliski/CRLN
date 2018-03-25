varying vec3 vPosition;
// uniform float lowFreq;

void main() {
  float dist  = distance(vPosition, vec3(0.0));

  float alpha = dist / 100.0;
  // alpha = mix(alpha, 0.0, 5.0 - dist);

  // vec3 color = mix(vec3(1.0), mix(color1, color2, lowFreq), min(dist * 0.008, 1.0));
  // vec3 color = vec3(1., 0., 0.);

  vec3 color = vec3(1.0);

  gl_FragColor = vec4(color, alpha * 0.4);
}
