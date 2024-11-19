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
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// Малювання мему
image.onload = () => {
  drawMeme();
};

function drawMeme() {
  // Очищення полотна
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Масштабування зображення
  const imgWidth = image.width;
  const imgHeight = image.height;
  const scale = Math.min(canvas.width / imgWidth, canvas.height / imgHeight);
  const x = (canvas.width - imgWidth * scale) / 2;
  const y = (canvas.height - imgHeight * scale) / 2;

  ctx.drawImage(image, x, y, imgWidth * scale, imgHeight * scale);

  // Текстові налаштування
  const textSize = parseInt(textSizeInput.value, 10);
  ctx.font = `${textSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillStyle = textColorInput.value;
  ctx.lineWidth = textSize / 10; // Обводка тексту
  ctx.strokeStyle = 'black';

  // Верхній текст
  if (topTextInput.value.trim() !== '') {
    const topText = topTextInput.value.toUpperCase();
    ctx.strokeText(topText, canvas.width / 2, textSize + 10);
    ctx.fillText(topText, canvas.width / 2, textSize + 10);
  }

  // Нижній текст
  if (bottomTextInput.value.trim() !== '') {
    const bottomText = bottomTextInput.value.toUpperCase();
    ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
    ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
  }
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

const resetBtn = document.getElementById('reset-btn');

resetBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  topTextInput.value = '';
  bottomTextInput.value = '';
  textColorInput.value = '#ffffff';
  textSizeInput.value = 40;
});


