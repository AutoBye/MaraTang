const images = ["snowy.jpg","montain.jpg","ddd.jpg"];

const chosenImage = images[Math.floor(Math.random() * images.length)];

const bgImage = document.createElement("img");

bgImage.src =`/images/${chosenImage}`;

document.body.appendChild(bgImage);