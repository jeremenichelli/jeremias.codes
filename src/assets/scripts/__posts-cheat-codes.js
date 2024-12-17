const INTERVAL = 750;

let lastInputTime = performance.now();
let storedInput = '';

const interactiveAction = (code, text) => {
  const element = document.querySelector(`[data-code="${code}"]`);

  if (element) element.innerHTML = text;
};

const cheatCodes = [
  {
    code: 'KeyAKeyBKeyCKeyD',
    action: (code) => interactiveAction(code, 'You did it!')
  },
  {
    code: 'Digit1Digit2Digit3Digit4',
    action: (code) => interactiveAction(code, 'You did it for this one too!')
  },
  {
    code: 'KeyGKeyAKeyMKeyEKeyOKeyVKeyEKeyR',
    action: (code) => interactiveAction(code, 'Hidden themes are gone!')
  }
];

window.addEventListener('keydown', (event) => {
  const now = performance.now();
  const timeElapsed = now - lastInputTime;

  if (timeElapsed > INTERVAL) {
    storedInput = '';
  }

  storedInput += event.code;

  cheatCodes.forEach(({ code, action }) => {
    if (code === storedInput) {
      action(code);
    }
  });

  lastInputTime = now;
});
