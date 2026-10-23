const cyanStyle =
  'color: #22d3ee; font-family: monospace; font-weight: bold; line-height: 1.2; text-shadow: 0 0 8px #22d3ee80;';
const purpleStyle =
  'color: #c084fc; font-family: monospace; font-weight: bold; line-height: 1.2; text-shadow: 0 0 8px #c084fc80;';
const pinkStyle =
  'color: #ff2d95; font-family: monospace; font-style: italic; line-height: 1.2; text-shadow: 0 0 8px #ff2d9580;';

console.log(
  String.raw`%c
    _   __
   / | / /___ __  __
  /  |/ / __ ${'`'}/ |/_/_____
 / /|  / /_/ />  </_____/
/_/ |_/\__, /_/|_|
%c _    %c/____/%c          __        __
| |     / /___  _____/ /_______/ /_  ____  ____
| | /| / / __ \/ ___/ //_/ ___/ __ \/ __ \/ __ \
| |/ |/ / /_/ / /  / ,< (__  ) / / / /_/ / /_/ /
|__/|__/\____/_/  /_/|_/____/_/ /_/\____/ .___/
                                       /_/
%c  [ Made with <3 - Wes ]
`,
  cyanStyle,
  purpleStyle,
  cyanStyle,
  purpleStyle,
  pinkStyle
);

import('./bootstrap').catch((err) => console.error(err));
