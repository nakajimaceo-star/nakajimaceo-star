(() => {
  'use strict';

  const header = document.querySelector('.header');
  const spCta = document.querySelector('.sp-cta');
  const hero = document.querySelector('.hero');

  // ヘッダー背景・スマホ固定CTAの表示切替
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    if (spCta && hero) spCta.classList.toggle('is-visible', y > hero.offsetHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ハンバーガーメニュー
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const setNav = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setNav(burger.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // スクロール表示アニメーション
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = [...entry.target.parentElement.children].filter((el) => el.classList.contains('reveal'));
        entry.target.style.transitionDelay = `${Math.min(siblings.indexOf(entry.target), 5) * 90}ms`;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // 数字のカウントアップ
  const nums = document.querySelectorAll('[data-count]');
  const fmt = new Intl.NumberFormat('ja-JP');
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = fmt.format(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    nums.forEach((el) => io.observe(el));
  }

  // お問い合わせフォーム（クライアント側バリデーション）
  // TODO: 送信先（フォームAPI / CMS）を接続する
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach((input) => {
      const ok = input.type === 'checkbox' ? input.checked : input.checkValidity();
      input.classList.toggle('is-invalid', !ok);
      if (!ok && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) {
      msg.textContent = '必須項目をご確認ください。';
      msg.className = 'form__msg is-error';
      firstInvalid.focus();
      return;
    }
    msg.textContent = 'お問い合わせありがとうございます。担当者より1営業日以内にご連絡いたします。';
    msg.className = 'form__msg is-ok';
    form.reset();
  });
})();
