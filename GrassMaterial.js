import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vHeight;

  uniform float uTime;
  uniform vec3 uInteractors[5]; // Up to 5 interaction points (hands, fingers)
  uniform float uInteractionStrength;

  // Simple noise function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vUv = uv;
    
    // Instance matrices
    vec3 instancePos = instanceMatrix[3].xyz;
    
    // Wind
    float windFreq = 0.5;
    float windAmp = 0.5;
    float noiseVal = noise(instancePos.xz * 0.1 + uTime * windFreq);
    
    // Interaction
    vec3 bendDir = vec3(0.0);
    float bendAmount = 0.0;
    
    for(int i = 0; i < 5; i++) {
        vec3 intPos = uInteractors[i];
        if (length(intPos) < 0.01) continue; // Skip inactive interactors
        
        float dist = distance(instancePos, intPos);
        float radius = 1.5; // Interaction radius
        
        if (dist < radius) {
            vec3 dir = normalize(instancePos - intPos);
            float influence = (1.0 - dist / radius);
            bendDir += dir * influence * 2.0;
            bendAmount += influence;
        }
    }

    // Apply Wind + Interaction to vertices
    vec3 transformed = position;
    
    // Only bend the top of the grass (uv.y > 0)
    float bendFactor = uv.y * uv.y; 
    
    // Wind bending
    transformed.x += sin(uTime * 2.0 + instancePos.x) * 0.2 * bendFactor;
    transformed.z += noiseVal * 0.5 * bendFactor;
    
    // Interaction bending (push away from interactor)
    transformed.x += bendDir.x * bendFactor * uInteractionStrength;
    transformed.z += bendDir.z * bendFactor * uInteractionStrength;
    
    // Flatten height slightly when bent
    transformed.y *= 1.0 - (length(bendDir) * 0.3 * bendFactor);

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    vWorldPosition = (instanceMatrix * vec4(transformed, 1.0)).xyz;
    vHeight = uv.y;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vHeight;
  
  uniform vec3 uColorBottom;
  uniform vec3 uColorTop;

  void main() {
    vec3 color = mix(uColorBottom, uColorTop, vHeight);
    
    // Add some fake shading
    // float shading = 1.0 - (1.0 - vHeight) * 0.5;
    
    gl_FragColor = vec4(color, 1.0);
    
    // Basic gamma correction
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/2.2));
  }
`;

export const GrassMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uColorBottom: { value: new THREE.Color(0x1a4a1a) },
    uColorTop: { value: new THREE.Color(0x4a8a2a) },
    uInteractors: { value: [new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)] },
    uInteractionStrength: { value: 1.0 }
  },
  side: THREE.DoubleSide
});

