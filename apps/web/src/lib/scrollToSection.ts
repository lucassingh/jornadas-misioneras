export function getNavH(): number {
  return window.innerWidth >= 900 ? 72 : 64;
}

export function scrollToSection(id: string) {
  window.dispatchEvent(new CustomEvent('jm:nav-start'));
  window.scrollTo({ top: window.scrollY, left: window.scrollX });

  requestAnimationFrame(() => {
    if (!id) {
      if (window.location.pathname !== '/') {
        window.location.href = '/';
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) {
      // Not on the home page — navigate there with the hash anchor
      window.location.href = `/#${id}`;
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY - getNavH();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  });
}
