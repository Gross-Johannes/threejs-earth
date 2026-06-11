import * as THREE from "three";

interface Star {
  position: THREE.Vector3;
  update: (time: number) => number;
}

interface StarfieldOptions {
  numStars?: number;
}

const MIN_RADIUS = 25;
const MAX_RADIUS = 50;

function createStar(): Star {
  const radius =
    Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;

  const u = Math.random();
  const v = Math.random();

  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);

  const position = new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  );

  const twinkleSpeed = Math.random() * 0.005;
  const shouldTwinkle = Math.random() > 0.9;
  const baseBrightness = Math.random();

  return {
    position,

    update(time: number): number {
      if (!shouldTwinkle) {
        return baseBrightness;
      }

      return baseBrightness + Math.sin(time * twinkleSpeed);
    },
  };
}

export default function getStarfield({
  numStars = 500,
}: StarfieldOptions = {}): THREE.Points {
  const stars: Star[] = [];

  const vertices: number[] = [];
  const colors: number[] = [];

  // Reused every frame to avoid allocations
  const tempColor = new THREE.Color();

  for (let i = 0; i < numStars; i++) {
    const star = createStar();
    stars.push(star);

    vertices.push(
      star.position.x,
      star.position.y,
      star.position.z
    );

    tempColor.setHSL(0.6, 0.2, Math.random());

    colors.push(
      tempColor.r,
      tempColor.g,
      tempColor.b
    );
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  const material = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load(
      "src/assets/textures/stars/circle.png"
    ),
    transparent: true,
  });

  const points = new THREE.Points(geometry, material);

  const colorAttribute = geometry.getAttribute(
    "color"
  ) as THREE.BufferAttribute;

  const colorArray = colorAttribute.array as Float32Array;

  function update(time: number): void {
    points.rotation.y -= 0.0002;

    for (let i = 0; i < stars.length; i++) {
      const brightness = stars[i].update(time);

      tempColor.setHSL(0.6, 0.2, brightness);

      const index = i * 3;

      colorArray[index] = tempColor.r;
      colorArray[index + 1] = tempColor.g;
      colorArray[index + 2] = tempColor.b;
    }

    colorAttribute.needsUpdate = true;
  }

  points.userData = {
    update,
  };

  return points;
}