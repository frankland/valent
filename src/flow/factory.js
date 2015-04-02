class FactoryModel {
  constructor(name) {
    if (name) {
      this.name = name;
    }

    this.dependencies = [];
  }
}

export default class FactoryFlow {
  constructor(name) {
    this.model = new FactoryModel(name);
  }

  at(name) {
    this.model.module = name;
    return this;
  }

  hasModule() {
    return !!this.model.module;
  }

  dependencies(dependencies) {
    if (!Array.isArray(dependencies)) {
      dependencies = [dependencies];
    }

    this.model.dependencies = this.model.dependencies.concat(dependencies);
    return this;
  }

  src(src) {
    this.model.src = src;
    return this;
  }
}

