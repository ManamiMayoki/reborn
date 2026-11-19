import gsap from 'gsap';

export const animateStageTransition = (containerRef, direction = 1) => {
  if (!containerRef?.current) return;

  const ctx = gsap.context(() => {
    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        x: direction > 0 ? 30 : -30,
        scale: 0.98,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
      }
    );
  }, containerRef);

  return () => ctx.revert();
};

export const animateCardStagger = (selector, parentRef) => {
  if (!parentRef?.current) return;

  const ctx = gsap.context(() => {
    gsap.fromTo(
      selector,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.45,
        ease: 'back.out(1.2)',
      }
    );
  }, parentRef);

  return () => ctx.revert();
};

export const pulseGlow = (elementRef, color = 'rgba(0, 229, 255, 0.4)') => {
  if (!elementRef?.current) return;

  return gsap.to(elementRef.current, {
    boxShadow: `0 0 25px 5px ${color}`,
    repeat: 3,
    yoyo: true,
    duration: 0.4,
    ease: 'power1.inOut',
  });
};
