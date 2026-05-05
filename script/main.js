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

const revealSections = document.querySelectorAll('.js-reveal-section');

if (revealSections.length) {
    let lastScrollY = window.scrollY;
    let revealFrameId = null;

    const updateRevealSections = () => {
        const currentScrollY = window.scrollY;
        const isScrollingUp = currentScrollY < lastScrollY;
        const viewportHeight = window.innerHeight;

        revealSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const shouldOpen = rect.top < viewportHeight * 0.72 && rect.bottom > viewportHeight * 0.18;
            const shouldCloseOnScrollUp = isScrollingUp && rect.top > viewportHeight * 0.34;
            const shouldCloseAfterSection = !isScrollingUp && rect.bottom < viewportHeight * 0.18;

            if (shouldOpen && !shouldCloseOnScrollUp) {
                section.classList.add('is-visible');
            }

            if (shouldCloseOnScrollUp || shouldCloseAfterSection) {
                section.classList.remove('is-visible');
            }
        });

        lastScrollY = currentScrollY;
        revealFrameId = null;
    };

    const requestRevealUpdate = () => {
        if (revealFrameId !== null) {
            return;
        }

        revealFrameId = requestAnimationFrame(updateRevealSections);
    };

    window.addEventListener('scroll', requestRevealUpdate, { passive: true });
    window.addEventListener('resize', requestRevealUpdate);
    requestRevealUpdate();
}
