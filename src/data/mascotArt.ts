import type { MascotId } from './mascots';

export type FaceKey = 'happy' | 'focused' | 'surprised' | 'joy';
export type Frame = { src: number; mirror?: boolean };

/* eslint-disable @typescript-eslint/no-require-imports */
const faces: Record<MascotId, Record<FaceKey, number>> = {
  byte: {
    happy: require('../../assets/mascots/faces/byte_0.png'),
    focused: require('../../assets/mascots/faces/byte_1.png'),
    surprised: require('../../assets/mascots/faces/byte_2.png'),
    joy: require('../../assets/mascots/faces/byte_3.png'),
  },
  oak: {
    happy: require('../../assets/mascots/faces/oak_1.png'),
    focused: require('../../assets/mascots/faces/oak_0.png'),
    surprised: require('../../assets/mascots/faces/oak_2.png'),
    joy: require('../../assets/mascots/faces/oak_3.png'),
  },
  volt: {
    happy: require('../../assets/mascots/faces/volt_0.png'),
    focused: require('../../assets/mascots/faces/volt_1.png'),
    surprised: require('../../assets/mascots/faces/volt_2.png'),
    joy: require('../../assets/mascots/faces/volt_3.png'),
  },
  sage: {
    happy: require('../../assets/mascots/faces/sage_0.png'),
    focused: require('../../assets/mascots/faces/sage_1.png'),
    surprised: require('../../assets/mascots/faces/sage_2.png'),
    joy: require('../../assets/mascots/faces/sage_3.png'),
  },
  momo: {
    happy: require('../../assets/mascots/faces/momo_1.png'),
    focused: require('../../assets/mascots/faces/momo_0.png'),
    surprised: require('../../assets/mascots/faces/momo_2.png'),
    joy: require('../../assets/mascots/faces/momo_3.png'),
  },
};

const t = {
  byte: [
    require('../../assets/mascots/turn/byte_0.png'),
    require('../../assets/mascots/turn/byte_1.png'),
    require('../../assets/mascots/turn/byte_2.png'),
    require('../../assets/mascots/turn/byte_3.png'),
    require('../../assets/mascots/turn/byte_4.png'),
  ],
  oak: [
    require('../../assets/mascots/turn/oak_0.png'),
    require('../../assets/mascots/turn/oak_1.png'),
    require('../../assets/mascots/turn/oak_2.png'),
    require('../../assets/mascots/turn/oak_3.png'),
    require('../../assets/mascots/turn/oak_4.png'),
  ],
  volt: [
    require('../../assets/mascots/turn/volt_0.png'),
    require('../../assets/mascots/turn/volt_1.png'),
    require('../../assets/mascots/turn/volt_2.png'),
    require('../../assets/mascots/turn/volt_3.png'),
    require('../../assets/mascots/turn/volt_4.png'),
  ],
  sage: [
    require('../../assets/mascots/turn/sage_0.png'),
    require('../../assets/mascots/turn/sage_1.png'),
    require('../../assets/mascots/turn/sage_2.png'),
    require('../../assets/mascots/turn/sage_3.png'),
    require('../../assets/mascots/turn/sage_4.png'),
  ],
  momo: [
    require('../../assets/mascots/turn/momo_0.png'),
    require('../../assets/mascots/turn/momo_1.png'),
    require('../../assets/mascots/turn/momo_2.png'),
    require('../../assets/mascots/turn/momo_3.png'),
    require('../../assets/mascots/turn/momo_4.png'),
  ],
} as Record<MascotId, number[]>;

/** One full 360° rotation, in order. Mirrored frames fill in the missing left-side views. */
const turns: Record<MascotId, Frame[]> = {
  byte: [{ src: t.byte[0] }, { src: t.byte[1] }, { src: t.byte[2] }, { src: t.byte[3] }, { src: t.byte[2], mirror: true }, { src: t.byte[4] }],
  oak: [{ src: t.oak[0] }, { src: t.oak[1] }, { src: t.oak[2] }, { src: t.oak[3] }, { src: t.oak[2], mirror: true }, { src: t.oak[4] }],
  volt: [{ src: t.volt[0] }, { src: t.volt[1] }, { src: t.volt[2] }, { src: t.volt[3] }, { src: t.volt[2], mirror: true }, { src: t.volt[4] }],
  sage: [{ src: t.sage[0] }, { src: t.sage[1] }, { src: t.sage[2] }, { src: t.sage[3] }, { src: t.sage[4] }, { src: t.sage[1], mirror: true }],
  momo: [{ src: t.momo[0] }, { src: t.momo[1] }, { src: t.momo[2] }, { src: t.momo[3] }, { src: t.momo[4] }, { src: t.momo[1], mirror: true }],
};

export const faceFor = (id: MascotId, key: FaceKey) => faces[id][key];
export const turnFrames = (id: MascotId) => turns[id];
export const FACE_KEYS: FaceKey[] = ['happy', 'focused', 'surprised', 'joy'];
export const FACE_LABELS: Record<FaceKey, string> = { happy: 'Happy', focused: 'Focused', surprised: 'Surprised', joy: 'Overjoyed' };

/** Every image the animations use, so screens can preload them and avoid a flash on first spin. */
export const allMascotImages = [
  ...Object.values(t).flat(),
  ...Object.values(faces).flatMap((f) => Object.values(f)),
];
