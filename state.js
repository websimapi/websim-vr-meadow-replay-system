export class StateRecorder {
  constructor(maxFrames = 600) { // 10-20 seconds buffer depending on FPS
    this.buffer = [];
    this.maxFrames = maxFrames;
    this.isRecording = true;
  }

  push(state) {
    if (!this.isRecording) return;
    this.buffer.push(state);
    if (this.buffer.length > this.maxFrames) {
      this.buffer.shift();
    }
  }

  getRecording() {
    // Clone to prevent mutation during playback
    return JSON.parse(JSON.stringify(this.buffer));
  }

  clear() {
    this.buffer = [];
  }
}

// Global instance for simplicity in this context, 
// though React Context is often cleaner, this ensures access outside render loop if needed.
export const recorder = new StateRecorder(900); // 30s at 30fps

