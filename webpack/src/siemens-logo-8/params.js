export const layers = {
    ENTIRE_SCENE: 0,
    BLOOM_SCENE: 1,
};
export const controlman = {
    target: {
        x: 0,
        y: 3,
        z: 0,
    },
    minDistance: 13,
    maxDistance: 21,
};
export const effectman = {
    scale: 1.25,
    bloom: {
        radius: 0.5,
        strength: 1.25,
        threshold: 0,
    },
    ssao: {
        kernelRadius: 2,
        kernelSize: 32,
        minDistance: 0,
        maxDistance: 0.1,   
    },
};
export const renderman = {
    autoClear: true,
    antialias: true,
    cam: {
        pos: {
            x: -12,
            y: 12,
            z: 12,
        },
        near: 6,
        far: 50,
    },    
    exposure: 0.65,
};