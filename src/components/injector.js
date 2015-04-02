class Injector {
  setInjector($injector) {
    if (this.$injector) {
      throw new Error('Injector component: $injector already exists');
    }

    this.$injector = $injector;
  }

  get(dependency) {
    var $injector = this.$injector;
    if (!$injector) {
      throw new Error('Injector is not defined');
    }

    if (!$injector.has(dependency)) {
      throw new Error('Dependency "' + dependency + '" does not exist');
    }


    return $injector.get(dependency);
  }
}

export default new Injector;
