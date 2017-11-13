export class Dialog {
  constructor(config){
    this.defaultConfig = {
      name:'dialog'
    }
    this.name = (config && config.name) || this.defaultConfig.name
  }
  say(){
    console.log(this.name)
  }
}

