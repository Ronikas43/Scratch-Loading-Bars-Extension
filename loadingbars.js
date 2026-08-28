// Name: Loading Bars
// ID: loadingbars
// Description: Add customizable loading/progress bars to your game
// By: Claude

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Loading Bars must run unsandboxed');
  }

  const vm = Scratch.vm;
  const runtime = vm.runtime;

  class LoadingBarManager {
    constructor() {
      this.bars = new Map();
      this.overlay = null;
      this._scaleX = 1;
      this._scaleY = 1;
      this._ensureOverlay();
      this._loop();
    }

    _ensureOverlay() {
      if (this.overlay && document.body.contains(this.overlay)) return;
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.pointerEvents = 'none';
      overlay.style.overflow = 'hidden';
      overlay.style.zIndex = '1000';
      document.body.appendChild(overlay);
      this.overlay = overlay;
    }

    _getCanvas() {
      return runtime.renderer && runtime.renderer.canvas;
    }

    _loop() {
      const step = () => {
        this._updateOverlayPosition();
        this.bars.forEach((bar) => this._render(bar));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    _updateOverlayPosition() {
      this._ensureOverlay();
      const canvas = this._getCanvas();
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      this.overlay.style.left = rect.left + window.scrollX + 'px';
      this.overlay.style.top = rect.top + window.scrollY + 'px';
      this.overlay.style.width = rect.width + 'px';
      this.overlay.style.height = rect.height + 'px';
      this._scaleX = rect.width / 480;
      this._scaleY = rect.height / 360;
    }

    _stageToPixelX(x) {
      return (x + 240) * this._scaleX;
    }
    _stageToPixelY(y) {
      return (180 - y) * this._scaleY;
    }

    createBar(name) {
      this._ensureOverlay();
      if (this.bars.has(name)) this.deleteBar(name);

      const outer = document.createElement('div');
      outer.style.position = 'absolute';
      outer.style.boxSizing = 'border-box';
      outer.style.border = '2px solid #000000';
      outer.style.overflow = 'hidden';

      const inner = document.createElement('div');
      inner.style.position = 'absolute';
      inner.style.left = '0';
      inner.style.top = '0';
      inner.style.height = '100%';
      inner.style.width = '0%';

      outer.appendChild(inner);
      this.overlay.appendChild(outer);

      const bar = {
        name,
        x: 0,
        y: 0,
        width: 200,
        height: 30,
        progress: 0,
        visible: true,
        borderColor: '#000000',
        borderWidth: 2,
        bgColor: '#dddddd',
        fillColor: '#4C97FF',
        outer,
        inner
      };
      this.bars.set(name, bar);
      this._render(bar);
      return bar;
    }

    getBar(name) {
      return this.bars.get(name);
    }

    ensureBar(name) {
      return this.getBar(name) || this.createBar(name);
    }

    deleteBar(name) {
      const bar = this.bars.get(name);
      if (bar) {
        bar.outer.remove();
        this.bars.delete(name);
      }
    }

    _render(bar) {
      const pixelWidth = bar.width * this._scaleX;
      const pixelHeight = bar.height * this._scaleY;
      const left = this._stageToPixelX(bar.x) - pixelWidth / 2;
      const top = this._stageToPixelY(bar.y) - pixelHeight / 2;

      bar.outer.style.left = left + 'px';
      bar.outer.style.top = top + 'px';
      bar.outer.style.width = pixelWidth + 'px';
      bar.outer.style.height = pixelHeight + 'px';
      bar.outer.style.backgroundColor = bar.bgColor;
      bar.outer.style.borderColor = bar.borderColor;
      bar.outer.style.borderWidth = bar.borderWidth + 'px';
      bar.outer.style.display = bar.visible ? 'block' : 'none';

      const pct = Math.max(0, Math.min(100, bar.progress));
      bar.inner.style.width = pct + '%';
      bar.inner.style.backgroundColor = bar.fillColor;
    }
  }

  const manager = new LoadingBarManager();

  class LoadingBarsExtension {
    getInfo() {
      return {
        id: 'loadingbars',
        name: 'Loading Bars',
        color1: '#4C97FF',
        color2: '#3373CC',
        blocks: [
          {
            opcode: 'createBar',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create loading bar [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' }
            }
          },
          '---',
          {
            opcode: 'goToXY',
            blockType: Scratch.BlockType.COMMAND,
            text: 'go to loading bar [NAME] x: [X] y: [Y]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'changeXY',
            blockType: Scratch.BlockType.COMMAND,
            text: 'change loading bar [NAME] x by: [X] y by: [Y]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          '---',
          {
            opcode: 'setX',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set loading bar [NAME] x to [X]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'changeX',
            blockType: Scratch.BlockType.COMMAND,
            text: 'change loading bar [NAME] x by [X]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setY',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set loading bar [NAME] y to [Y]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'changeY',
            blockType: Scratch.BlockType.COMMAND,
            text: 'change loading bar [NAME] y by [Y]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          '---',
          {
            opcode: 'setSize',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set loading bar [NAME] width: [WIDTH] height: [HEIGHT]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              WIDTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
              HEIGHT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 30 }
            }
          },
          '---',
          {
            opcode: 'setFillColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set loading bar [NAME] fill color to [COLOR]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              COLOR: { type: Scratch.ArgumentType.COLOR }
            }
          },
          {
            opcode: 'setBackgroundColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set loading bar [NAME] background color to [COLOR]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              COLOR: { type: Scratch.ArgumentType.COLOR }
            }
          },
          {
            opcode: 'setBorderColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set loading bar [NAME] border color to [COLOR]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              COLOR: { type: Scratch.ArgumentType.COLOR }
            }
          },
          {
            opcode: 'setBorderWidth',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set loading bar [NAME] outline thickness to [WIDTH]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              WIDTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
            }
          },
          '---',
          {
            opcode: 'setProgress',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set loading bar [NAME] progress to [PERCENT] %',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              PERCENT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
            }
          },
          {
            opcode: 'changeProgress',
            blockType: Scratch.BlockType.COMMAND,
            text: 'change loading bar [NAME] progress by [PERCENT] %',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' },
              PERCENT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'getProgress',
            blockType: Scratch.BlockType.REPORTER,
            text: 'progress of loading bar [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' }
            }
          },
          '---',
          {
            opcode: 'showBar',
            blockType: Scratch.BlockType.COMMAND,
            text: 'show loading bar [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' }
            }
          },
          {
            opcode: 'hideBar',
            blockType: Scratch.BlockType.COMMAND,
            text: 'hide loading bar [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' }
            }
          },
          {
            opcode: 'deleteBar',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete loading bar [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' }
            }
          },
          {
            opcode: 'barExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'loading bar [NAME] exists?',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'bar1' }
            }
          }
        ]
      };
    }

    createBar(args) {
      manager.createBar(String(args.NAME));
    }

    goToXY(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.x = Number(args.X);
      bar.y = Number(args.Y);
    }

    changeXY(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.x += Number(args.X);
      bar.y += Number(args.Y);
    }

    setX(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.x = Number(args.X);
    }

    changeX(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.x += Number(args.X);
    }

    setY(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.y = Number(args.Y);
    }

    changeY(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.y += Number(args.Y);
    }

    setSize(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.width = Math.max(1, Number(args.WIDTH));
      bar.height = Math.max(1, Number(args.HEIGHT));
    }

    setFillColor(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.fillColor = args.COLOR;
    }

    setBackgroundColor(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.bgColor = args.COLOR;
    }

    setBorderColor(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.borderColor = args.COLOR;
    }

    setBorderWidth(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.borderWidth = Math.max(0, Number(args.WIDTH));
    }

    setProgress(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.progress = Math.max(0, Math.min(100, Number(args.PERCENT)));
    }

    changeProgress(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.progress = Math.max(0, Math.min(100, bar.progress + Number(args.PERCENT)));
    }

    getProgress(args) {
      const bar = manager.getBar(String(args.NAME));
      return bar ? bar.progress : 0;
    }

    showBar(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.visible = true;
    }

    hideBar(args) {
      const bar = manager.ensureBar(String(args.NAME));
      bar.visible = false;
    }

    deleteBar(args) {
      manager.deleteBar(String(args.NAME));
    }

    barExists(args) {
      return manager.bars.has(String(args.NAME));
    }
  }

  Scratch.extensions.register(new LoadingBarsExtension());
})(Scratch);
