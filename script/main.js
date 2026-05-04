const hero = document.querySelector('.js-hero-parallax');

if (hero) {
    const layers = hero.querySelectorAll('[data-depth]');
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let target = 0;
    let current = 0;

    const setTarget = () => {
        const rect = hero.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const totalDistance = viewportHeight + rect.height;
        const scrolledDistance = viewportHeight - rect.top;

        target = Math.min(Math.max(scrolledDistance / totalDistance, 0), 1) - 0.5;
    };

    const render = () => {
        current += (target - current) * 0.08;

        layers.forEach((layer) => {
            const depth = Number(layer.dataset.depth);
            const y = current * depth;

            layer.style.transform = `translate3d(0, ${y}px, 0)`;
        });

        requestAnimationFrame(render);
    };

    if (!mediaQuery.matches) {
        window.addEventListener('scroll', setTarget, { passive: true });
        window.addEventListener('resize', setTarget);
        setTarget();
        render();
    }
}
