let dispose = () => {};
let activeBody: HTMLElement | undefined;

// Essential controls do not depend on GSAP or on animation downloads.
export function initInteractions() {
  if (activeBody === document.body) return;
  dispose();
  activeBody = document.body;
  const controller = new AbortController();
  const {signal} = controller;
  const toggle = document.querySelector<HTMLButtonElement>('.menu-button');
  const menu = document.querySelector<HTMLDialogElement>('.menu-dialog');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector<HTMLElement>('.header');
  const updateHeaderOffset = () => {
    if (header) document.documentElement.style.setProperty('--header-offset', `${Math.ceil(header.getBoundingClientRect().height) + 16}px`);
  };
  updateHeaderOffset();
  if (header && typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(updateHeaderOffset);
    observer.observe(header);
    signal.addEventListener('abort', () => observer.disconnect(), {once: true});
  }
  const closeOverlays = () => {
    document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(dialog => dialog.close());
    document.documentElement.classList.remove('menu-open', 'lightbox-open');
  };
  dispose = () => {
    controller.abort();
    closeOverlays();
    document.body.classList.remove('input-focus', 'keyboard-open');
    document.documentElement.style.removeProperty('--header-offset');
    activeBody = undefined;
  };
  toggle?.addEventListener('click', () => {
    if (!menu || menu.open) return;
    menu.showModal();
    menu.scrollTop = 0;
    toggle.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-open');
    menu.querySelector<HTMLButtonElement>('.menu-close')?.focus({preventScroll: true});
    menu.dispatchEvent(new CustomEvent('beautyme:menu-open', {bubbles: true}));
  }, {signal});
  menu?.querySelector('.menu-close')?.addEventListener('click', () => menu.close(), {signal});
  menu?.addEventListener('click', event => {
    if (event.target !== menu) return;
    const r = menu.getBoundingClientRect();
    const pointer = event as MouseEvent;
    if (pointer.clientX < r.left || pointer.clientX > r.right || pointer.clientY < r.top || pointer.clientY > r.bottom) menu.close();
  }, {signal});
  menu?.addEventListener('close', () => {
    document.documentElement.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.focus({preventScroll: true});
  }, {signal});
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close(), {signal}));

  document.querySelectorAll<HTMLElement>('[data-service-explorer]').forEach(explorer => {
    const choices = [...explorer.querySelectorAll<HTMLButtonElement>('[data-service]')];
    const panels = [...explorer.querySelectorAll<HTMLElement>('[data-panel]')];
    const select = (button: HTMLButtonElement) => {
      if (button.classList.contains('active')) return;
      const next = panels.find(panel => panel.dataset.panel === button.dataset.service);
      if (!next) return;
      choices.forEach(choice => {
        choice.classList.toggle('active', choice === button);
        choice.setAttribute('aria-pressed', String(choice === button));
      });
      panels.forEach(panel => {panel.hidden = panel !== next;});
      const status = explorer.querySelector<HTMLElement>('[data-service-status]');
      if (status) status.textContent = button.querySelector('.explorer-label')?.firstChild?.textContent || '';
      if (!reduced.matches && typeof next.animate === 'function') next.animate([{opacity: .5, transform: 'translateY(6px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 240, easing: 'ease-out'});
      explorer.dispatchEvent(new CustomEvent('beautyme:layout-change', {bubbles: true}));
    };
    choices.forEach((button, index) => {
      button.addEventListener('click', () => select(button), {signal});
      button.addEventListener('pointerenter', event => {if (event.pointerType === 'mouse') select(button);}, {signal});
      button.addEventListener('focus', () => select(button), {signal});
      button.addEventListener('keydown', event => {
        const offset = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
        if (!offset) return;
        event.preventDefault();
        choices[(index + offset + choices.length) % choices.length].focus();
      }, {signal});
    });
    explorer.querySelectorAll<HTMLAnchorElement>('[data-shared-image]').forEach(link => link.addEventListener('click', () => {
      const image = link.closest('.explorer-panel')?.querySelector<HTMLElement>('.explorer-image');
      if (image) image.style.viewTransitionName = `service-${link.dataset.sharedImage}`;
    }, {signal}));
  });
  const updateKeyboard = () => {
    const focused = document.activeElement;
    const textField = focused instanceof HTMLTextAreaElement || focused instanceof HTMLSelectElement || (focused instanceof HTMLInputElement && !['radio', 'checkbox', 'button', 'submit'].includes(focused.type));
    document.body.classList.toggle('input-focus', textField);
    document.body.classList.toggle('keyboard-open', textField && !!window.visualViewport && window.visualViewport.height < window.innerHeight * .8);
  };
  document.addEventListener('focusin', updateKeyboard, {signal});
  document.addEventListener('focusout', () => queueMicrotask(updateKeyboard), {signal});
  window.visualViewport?.addEventListener('resize', updateKeyboard, {signal});
}

document.addEventListener('astro:page-load', initInteractions);
document.addEventListener('astro:before-swap', () => dispose());
if (document.readyState !== 'loading') initInteractions();
