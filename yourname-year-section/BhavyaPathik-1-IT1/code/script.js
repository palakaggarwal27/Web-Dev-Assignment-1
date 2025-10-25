document.getElementById("scroll-top").addEventListener("click", function(){
    window.scrollTo({top: 0, behavior: 'smooth'});
});
const glow = document.querySelector('.cursorglow');
  let x = 0, y = 0, targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animate() {
    x += (targetX - x) * 0.20;
    y += (targetY - y) * 0.20;
    glow.style.transform = `translate(${x - glow.offsetWidth / 2}px, ${y - glow.offsetHeight / 2}px)`;
    requestAnimationFrame(animate);
  }
  animate();
