/* ============================================================
   qr-codes.js — QR-коды ТОЛЬКО из локальной папки qr/
   Если файла нет — ячейка остаётся пустой (без ссылки).
   ============================================================ */
(function () {
    'use strict';

    function populate() {
        var els = document.querySelectorAll('.qr-code[data-key]');
        console.log('[qr-codes] найдено элементов: ' + els.length);

        els.forEach(function (el) {
            var key = el.getAttribute('data-key');
            if (!key) return;

            var img = document.createElement('img');
            img.src = 'qr/' + key + '.png';
            img.alt = 'QR: ' + key;
            img.setAttribute('width', '90');
            img.setAttribute('height', '90');
            img.style.cssText = 'width:100%;height:100%;display:block;';

            img.onload = function () {
                console.log('[qr-codes] OK: ' + key);
            };
            img.onerror = function () {
                console.warn('[qr-codes] НЕ НАЙДЕН файл: qr/' + key + '.png');
                // ничего не показываем — просто пустая ячейка
            };

            el.innerHTML = '';
            el.appendChild(img);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', populate);
    } else {
        populate();
    }
})();
