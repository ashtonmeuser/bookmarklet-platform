export default class XMLHttpRequest {
  open(_, url) {
    this.url = url;
  }

  send() {
    this.status = global.responseStatus || 200;
    this.response = global.responseBody || 'success';
    global.responseStatus = undefined;
    global.responseBody = undefined;
    if (this.status === 500) return this.onerror();
    return this.onload();
  }
}
