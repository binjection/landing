function loadSprite(src, callback) {
  sprite = new Image();
  sprite.onload = () => { callback(sprite) };
  sprite.src = src;
}
