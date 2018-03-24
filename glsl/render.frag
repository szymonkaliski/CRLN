varying vec3 vPosition;
// uniform float lowFreq;

void main() {
  vec3 color1 = vec3(138.0 / 255.0, 198.0 / 255.0, 198.0 / 250.0);
  vec3 color2 = vec3(170.0 / 255.0,  61.0 / 255.0,  93.0 / 255.0);

  float dist  = distance(vPosition, vec3(0.0));

  float alpha = dist / 200.0;
  // alpha = mix(alpha, 0.0, 5.0 - dist);

  // vec3 color = mix(vec3(1.0), mix(color1, color2, lowFreq), min(dist * 0.008, 1.0));
  // vec3 color = vec3(1., 0., 0.);

  vec3 color = color1;

  gl_FragColor = vec4(color, alpha * 0.8);
}
