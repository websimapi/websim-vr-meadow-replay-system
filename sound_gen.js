export class WindSound {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.nodes = [];
        this.gainNode = this.ctx.createGain();
        this.gainNode.connect(this.ctx.destination);
        this.gainNode.gain.value = 0.05; // Base volume
    }

    start() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        // Pink Noise generator
        const bufferSize = 4096;
        const pinkNoise = this.ctx.createScriptProcessor(bufferSize, 1, 1);
        pinkNoise.onaudioprocess = (e) => {
            const output = e.outputBuffer.getChannelData(0);
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; // (roughly) compensate for gain
                b6 = white * 0.115926;
            }
        };

        // Filter to shape wind sound
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        filter.Q.value = 1;

        pinkNoise.connect(filter);
        filter.connect(this.gainNode);
        
        this.filter = filter;
        this.noise = pinkNoise;
        
        // Modulation loop
        this.modulate();
    }
    
    modulate() {
        if(!this.filter) return;
        const time = Date.now() / 1000;
        // Vary frequency to simulate gusts
        const gust = Math.sin(time * 0.5) * 200 + Math.sin(time * 1.3) * 100;
        this.filter.frequency.value = 400 + gust;
        
        requestAnimationFrame(() => this.modulate());
    }
}

export const windAudio = new WindSound();

