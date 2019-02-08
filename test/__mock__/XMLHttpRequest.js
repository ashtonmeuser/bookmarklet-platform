class mockXhr {
  constructor() {
    this.url = null;
    this.status = null;
    this.response = null;
    this.onerror = () => { };
    this.onload = () => { };
  }

  open(_, url) {
    this.url = url;
  }

  send() {
    switch (this.url) {
      case 'failError':
        this.status = 500;
        this.onerror();
        break;
      case 'failStatus':
        this.status = 400;
        this.onload();
        break;
      default:
        this.status = 200;
        this.response = 'success';
        this.onload();
    }
  }
}

module.exports = mockXhr;
