import Config from './config';

var colors = Config.getColors();

var counter = 0;

function getColor() {
  if (counter == colors.length) {
    counter = 0;
  }

  return colors[counter++];
}


var id = Symbol('id');

export default class Logger {
  constructor(name, background, color){
    this[id] = name;

    this.background = background || '#ffff';
    this.color = color || '#000';

    this.debug = Config.debug();
    this.isDetailed = false;
  }

  static getNextColor() {
    return getColor();
  }

  static create(name) {
    var background = this.getNextColor();
    var color = '#fff;';

    return new Logger(name, background, color);
  }

  setBackgroundColor(background) {
    this.background = background;
  }

  setColor(color) {
    this.color = color;
  }

  enable(isDetailed) {
    if (isDetailed) {
      this.isDetailed = true;
    }

    this.debug = true;
  }

  disable() {
    this.isDetailed = false;
    this.debug = false;
  }


  getCompleteMessage(message) {
    return `${this[id]}: ${message}`;
  }

  error (message){
    var completeMessage = this.getCompleteMessage(message);
    console.error(completeMessage);
  }

  log(message, value) {
    if (this.debug) {
      var completeMessage = this.getCompleteMessage(message);

      console.log(`%c ${completeMessage}`, `background: ${this.background}; color: ${this.color}`);

      if (this.isDetailed && arguments.length == 2) {
        console.log(value);
      }
    }
  }

  warn(message, value) {
    if (this.debug) {
      var completeMessage = this.getCompleteMessage(message);

      console.warn(`%c ${completeMessage}`, `background: ${this.background}; color: ${this.color}`);

      if (this.isDetailed && arguments.length == 2) {
        console.warn(value);
      }
    }
  }
}
