var colors = [
  '#008EBA',
  '#99CC00',
  '#AA66CC',
  '#FD7400',
  '#723147',
  '#FF5F5F',
  '#AC59D6',
  '#6B5D99',
  '#FFBB33',
  '#FF4444',
  '#1F8A70',
  '#9BCF2E',
  '#004358',
  '#979C9C',
  '#962D3E',
  '#35478C',
  '#5F9C6D',
  '#FD7400',
  '#16193B',
  '#7FB2F0'
];

var config = {
  colors,
  debug: false,
  app: 'frankland.valent'
};

class ConfigManager {
  constructor() {

  }

  getColors() {
    return config.colors;
  }

  debug(debug){
    config.debug = !debug;
  }

  isDebug() {
    return colors.debug;
  }

  getApplicationName() {
    return config.app;
  }

  setApplicationName(name) {
    config.app = name;
  }
}


export default new ConfigManager();
