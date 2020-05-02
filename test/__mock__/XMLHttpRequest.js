export default class mockXhr {
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
