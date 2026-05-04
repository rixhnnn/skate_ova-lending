const hero = document.querySelector('.js-hero-parallax');

if (hero) {
    const layers = hero.querySelectorAll('[data-depth]');
    const layerData = Array.from(layers, (layer) => ({
        element: layer,
        depth: Number(layer.dataset.depth),
        offsetY: Number(layer.dataset.offsetY || 0)
    }));
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrowQuery = window.matchMedia('(max-width: 1000px)');
    const scrollPower = 14;
    let target = 0;
    let current = 0;
    let frameId = null;
    let targetFrameId = null;

    const setTarget = () => {
        const rect = hero.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const totalDistance = viewportHeight + rect.height;
        const scrolledDistance = viewportHeight - rect.top;

        target = Math.min(Math.max(scrolledDistance / totalDistance, 0), 1) - 0.5;
    };

    const render = () => {
        current += (target - current) * 0.055;

        layerData.forEach(({ element, depth, offsetY }) => {
            const y = offsetY + current * depth * scrollPower;

            element.style.transform = narrowQuery.matches
                ? `translateY(${y}px)`
                : `translate3d(0, ${y}px, 0)`;
        });

        if (Math.abs(target - current) > 0.001) {
            frameId = requestAnimationFrame(render);
        } else {
            current = target;
            frameId = null;
        }
    };

    const requestRender = () => {
        if (targetFrameId !== null) {
            return;
        }

        targetFrameId = requestAnimationFrame(() => {
            targetFrameId = null;
            setTarget();

            if (frameId === null) {
                frameId = requestAnimationFrame(render);
            }
        });
    };

    if (!mediaQuery.matches) {
        window.addEventListener('scroll', requestRender, { passive: true });
        window.addEventListener('resize', requestRender);
        narrowQuery.addEventListener('change', requestRender);
        requestRender();
    }
}
