import iziToast from 'izitoast';

const base = {
  position: 'topRight',
  timeout: 3000,
  progressBar: true,
  pauseOnHover: true,
  close: true,
};

export const toast = {
  success(message, title = 'OK') {
    iziToast.success({ ...base, title, message });
  },
  error(message, title = 'Error') {
    iziToast.error({ ...base, title, message, timeout: 5000 });
  },
  warning(message, title = 'Atención') {
    iziToast.warning({ ...base, title, message, timeout: 4500 });
  },
  info(message, title = 'Info') {
    iziToast.info({ ...base, title, message });
  },
};

export function confirm({
  title = 'Confirmar',
  message = '¿Estás seguro?',
  okText = 'Confirmar',
  cancelText = 'Cancelar',
  color = '#3b82f6',
} = {}) {
  return new Promise((resolve) => {
    iziToast.question({
      ...base,
      timeout: false,
      overlay: true,
      close: false,
      title,
      message,
      buttons: [
        [
          `<button style="background:${color};border:none;color:#fff;padding:8px 14px;border-radius:6px;cursor:pointer;">${okText}</button>`,
          (instance, toastEl) => {
            instance.hide({ transitionOut: 'fadeOut' }, toastEl, 'button');
            resolve(true);
          },
          true,
        ],
        [
          `<button style="background:transparent;border:1px solid rgba(255,255,255,.25);color:#fff;padding:8px 14px;border-radius:6px;cursor:pointer;">${cancelText}</button>`,
          (instance, toastEl) => {
            instance.hide({ transitionOut: 'fadeOut' }, toastEl, 'button');
            resolve(false);
          },
        ],
      ],
    });
  });
}
