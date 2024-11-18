const canvas = document.getElementById('meme-canvas');
const ctx = canvas.getContext('2d');
const uploadImage = document.getElementById('upload-image');
const topTextInput = document.getElementById('top-text');
const bottomTextInput = document.getElementById('bottom-text');
const textColorInput = document.getElementById('text-color');
const textSizeInput = document.getElementById('text-size');
const downloadBtn = document.getElementById('download-btn');

canvas.width = 500;
canvas.height = 500;

let image = new Image();

// Завантаження зображення
uploadImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    image.src = reader.result;
    image.onload = () => {
      drawMeme();
    };
  };

  reader.readAsDataURL(file);
});

// Малювання мему
function drawMeme() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const textSize = parseInt(textSizeInput.value, 10);
  ctx.font = `${textSize}px Arial`;
  ctx.fillStyle = textColorInput.value;
  ctx.textAlign = 'center';

  // Верхній текст
  ctx.fillText(topTextInput.value.toUpperCase(), canvas.width / 2, textSize);

  // Нижній текст
  ctx.fillText(
    bottomTextInput.value.toUpperCase(),
    canvas.width / 2,
    canvas.height - 20
  );
}

// Оновлення тексту в реальному часі
[topTextInput, bottomTextInput, textColorInput, textSizeInput].forEach(input =>
  input.addEventListener('input', drawMeme)
);

// Завантаження мему
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
});
