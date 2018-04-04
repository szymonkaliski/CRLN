const THREE = require("three");

const SPHERICAL_PHI_MAX = 2.0;
const SPHERICAL_PHI_MIN = -2.0;
const SPHERICAL_THETA_MAX = 2.0;
const SPHERICAL_THETA_MIN = -2.0;
const CAMERA_DAMPING = 0.01;
const CAMERA_UPDATE_K = 0.005;
const CAMERA_Z = 200;

module.exports = camera => {
  const offset = new THREE.Vector3();

  const rotateEnd = new THREE.Vector2();
  const rotateStart = new THREE.Vector2();
  const rotateDelta = new THREE.Vector2();

  const spherical = new THREE.Spherical();
  const sphericalDelta = new THREE.Spherical();

  const quat = new THREE.Quaternion().setFromUnitVectors(
    camera.up,
    new THREE.Vector3(0, 1, 0)
  );
  const quatInverse = quat.clone().inverse();
  const target = new THREE.Vector3();

  const rotateSpeed = 0.2;

  const onMouseMove = () => {
    rotateEnd.set(
      event.clientX - window.innerWidth / 2,
      event.clientY - window.innerHeight / 2
    );

    rotateDelta.subVectors(rotateEnd, rotateStart);

    sphericalDelta.theta -=
      2 * Math.PI * rotateDelta.x / window.innerWidth * rotateSpeed;

    sphericalDelta.phi -=
      2 * Math.PI * rotateDelta.y / window.innerHeight * rotateSpeed;

    rotateStart.copy(rotateEnd);
  };

  window.addEventListener("mousemove", onMouseMove, false);

  const update = () => {
    offset.copy(camera.position).sub(target);
    offset.applyQuaternion(quat);

    spherical.setFromVector3(offset);
    spherical.theta += sphericalDelta.theta * CAMERA_UPDATE_K;
    spherical.phi += sphericalDelta.phi * CAMERA_UPDATE_K;
    spherical.radius = CAMERA_Z;

    spherical.phi = Math.max(
      SPHERICAL_PHI_MIN,
      Math.min(SPHERICAL_PHI_MAX, spherical.phi)
    );

    spherical.theta = Math.max(
      SPHERICAL_THETA_MIN,
      Math.min(SPHERICAL_THETA_MAX, spherical.theta)
    );

    spherical.makeSafe();

    offset.setFromSpherical(spherical);
    offset.applyQuaternion(quatInverse);

    camera.position.copy(target).add(offset);
    camera.lookAt(target);

    sphericalDelta.theta *= 1 - CAMERA_DAMPING;
    sphericalDelta.phi *= 1 - CAMERA_DAMPING;
  };

  return { update };
};
