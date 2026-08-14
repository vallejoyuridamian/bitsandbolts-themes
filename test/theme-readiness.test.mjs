import assert from 'node:assert/strict';
import test from 'node:test';

import {
  installThemeReadiness,
  themeFontProfile,
  waitForThemeFonts
} from '../components/theme-readiness.js';

function themeSheet(values) {
  return {
    cssRules: [{
      style: {
        getPropertyValue(property) {
          return values[property] || '';
        }
      }
    }]
  };
}

const themeValues = {
  '--bb-font-family-display': 'Orbitron',
  '--bb-font-family-body': 'Montserrat',
  '--bb-font-family-mono': 'JetBrains Mono',
  '--bb-font-family-terminal': 'JetBrains Mono',
  '--bb-marketing-chrome-meta-font': 'Montserrat',
  '--bb-font-weight-regular': '400',
  '--bb-font-weight-medium': '500',
  '--bb-font-weight-semibold': '600',
  '--bb-font-weight-bold': '700'
};

test('theme readiness derives the exact theme font profile and loads every required face', async () => {
  const link = { sheet: themeSheet(themeValues) };
  const profile = themeFontProfile([link]);
  assert.deepEqual(profile.families, ['Orbitron', 'Montserrat', 'JetBrains Mono']);
  assert.deepEqual(profile.weights, ['400', '500', '600', '700']);

  const requests = [];
  const root = {
    fonts: {
      load(specification) {
        requests.push(specification);
        return Promise.resolve([{}]);
      },
      ready: Promise.resolve()
    }
  };
  assert.equal(await waitForThemeFonts([link], root), true);
  assert.equal(requests.length, 12);
  assert.ok(requests.includes('700 1em "Orbitron"'));
  assert.ok(requests.includes('400 1em "Montserrat"'));
  assert.ok(requests.includes('500 1em "JetBrains Mono"'));
});

test('initial presentation stays pending until theme styles and fonts are ready', async () => {
  const themeLink = {
    dataset: {
      bbPageThemeFamily: 'bitsandbolts',
      bbPageThemeMode: 'light'
    },
    sheet: themeSheet(themeValues)
  };
  const typographyLink = { sheet: { cssRules: [] } };
  const documentElement = {
    dataset: {
      bbPageThemeFamily: 'bitsandbolts',
      bbThemeReadiness: 'pending',
      theme: 'light'
    }
  };
  const root = {
    documentElement,
    fonts: {
      load() {
        return Promise.resolve([{}]);
      },
      ready: Promise.resolve()
    },
    querySelectorAll(selector) {
      return selector.includes('typography.css') ? [typographyLink] : [themeLink];
    }
  };

  assert.equal(await installThemeReadiness(root), true);
  assert.equal(documentElement.dataset.bbThemeReadiness, 'ready');
});
