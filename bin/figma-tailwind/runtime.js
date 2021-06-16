import { propertiesToClass } from './lib/translate-slim.js';

function translate(event) {
  if (event.button !== 0) {
    return;
  }

  const paneEl = document.querySelector('[class*="inspect_panels--tabularInspectionPanel"] > div > div > div > div');
  paneEl.style.display = 'flex';
  paneEl.style.flexDirection = 'column';

  // Remove previously translated elements if any.
  paneEl.querySelectorAll('span.translated').forEach((el) => el.remove());
  const lastPaneChild = paneEl.children[paneEl.children.length - 1];
  if (lastPaneChild.tagName === 'DIV' && lastPaneChild.classList.length === 0) {
    lastPaneChild.style.display = 'none';
  }

  const findPropertyGroup = (i) => {
    let lineEls = [];
    const separatorEl = Array.from(paneEl.querySelectorAll('div')).filter((el) => el.classList.length === 0)?.[i];
    if (!separatorEl) {
      return {
        lastEl: null,
        classnames: null,
      };
    }

    let iteratorEl = separatorEl.nextElementSibling;
    while (true) {
      if (i === 0 && iteratorEl?.classList.length === 0) {
        break;
      }

      if (iteratorEl.tagName === 'DIV' && iteratorEl?.classList.length > 0) {
        lineEls.push(iteratorEl);
      }

      if (i === 1 && !iteratorEl.nextElementSibling) {
        break;
      }
      iteratorEl = iteratorEl.nextElementSibling;
    }

    const properties = Array.from(lineEls).map((el) => el.textContent.slice(0, -1));
    const classnames = properties
      .map((prop) => propertiesToClass(prop, byProperties)?.replace('\\', ''))
      .filter(Boolean)
      .join(' ');

    return {
      lastEl: iteratorEl,
      classnames,
    };
  };

  // Attach translated elements to the inspector pane
  const attach = (el, classnames, position) => {
    if (!el || !classnames) {
      return;
    }
    const translatedEl = document.createElement('SPAN');
    translatedEl.textContent = classnames;
    translatedEl.classList.add('translated');
    translatedEl.style.border = '1px solid #06B6D4';
    translatedEl.style.borderRadius = '6px';
    translatedEl.style.padding = '2px 8px';
    translatedEl.style.marginTop = '8px';
    translatedEl.style.display = 'block';
    translatedEl.style.alignSelf = 'self-start';
    el.insertAdjacentElement(position, translatedEl);
  };

  const { lastEl: positionEl, classnames: positionClassnames } = findPropertyGroup(0);
  const { lastEl: restEl, classnames: restClassnames } = findPropertyGroup(1);

  attach(positionEl, positionClassnames, 'beforebegin');
  attach(restEl, restClassnames, 'afterend');
}

function translateDelayed(event) {
  window.setTimeout(() => {
    translate(event);
  }, 50);
}

const canvas = document.querySelector('canvas');
canvas.removeEventListener('mouseup', translateDelayed);
canvas.addEventListener('mouseup', translateDelayed);
