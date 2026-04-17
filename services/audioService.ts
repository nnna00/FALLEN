
// A procedural audio engine using Web Audio API
// No external files required. Generates sound in real-time.

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let droneNodes: { osc: OscillatorNode, gain: GainNode }[] = [];
let isDronePlaying = false;

const initAudio = () => {
  if (ctx) return ctx;
  const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
  ctx = new AudioContextClass();
  masterGain = ctx!.createGain();
  masterGain.connect(ctx!.destination);
  masterGain.gain.value = 0.3; // Master volume
  return ctx;
};

export const startAudio = async () => {
  const context = initAudio();
  if (context?.state === 'suspended') {
    await context.resume();
  }
  if (!isDronePlaying) {
    playDrone();
  }
};

const playDrone = () => {
  if (!ctx || !masterGain) return;
  
  // Create a dark, unstable drone sound
  const freqs = [55, 110, 112]; // Low A notes with slight dissonance
  
  freqs.forEach((f, i) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    const filter = ctx!.createBiquadFilter();
    
    osc.type = i === 0 ? 'sawtooth' : 'sine';
    osc.frequency.value = f;
    
    // Lowpass filter to make it deep/muffled
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    // Slow LFO for movement
    const lfo = ctx!.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1 + Math.random() * 0.1;
    const lfoGain = ctx!.createGain();
    lfoGain.gain.value = 50;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    gain.gain.value = 0.05; // Quiet background
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain!);
    osc.start();
    
    droneNodes.push({ osc, gain });
  });
  
  isDronePlaying = true;
};

export const playSfx = (type: 'click' | 'hover' | 'flip' | 'open' | 'type') => {
  if (!ctx || !masterGain) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  const now = ctx.currentTime;

  switch (type) {
    case 'click':
      // Mechanical / Glass click
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.linearRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;

    case 'hover':
      // High tech chirp
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.linearRampToValueAtTime(1500, now + 0.05);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;

    case 'flip':
      // Whoosh sound (Filtered noise simulation using saw)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(2000, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.5);
      break;

    case 'open':
      // Heavy boom/thud
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
      
    case 'type':
       // Very short click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
  }
};
