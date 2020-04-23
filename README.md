# youtube-settings-button

YouTube like setting button

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/@iyaroslav/youtube-settings-button.svg)](https://www.npmjs.com/package/@iyaroslav/youtube-settings-button) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Attention! This widget is under construction. Do not use it in your projects.

## Install

```bash
yarn add @iyaroslav/youtube-settings-button
# or
npm install --save @iyaroslav/youtube-settings-button
```

## Usage

```tsx
import React, { Component } from 'react'

import Setting from '@iyaroslav/youtube-settings-button'
import '@iyaroslav/youtube-settings-button/dist/index.css'

class Example extends Component {
  const [config, setConfig] = useState({
    autoplay: true,
    annotations: false,
    playbackSpeed: [
      'Normal',
      ['0.5', '0.75', 'Normal', '1.25', '1.5']
    ]
  })

  render() {
    return <Settings
      hd
      settings={config}
      onChange={setConfig}
    />
  }
}
```

## TODO
- [ ] Switches
- [ ] Animations
- [ ] Move menu to external component
- [ ] Animated switches
- [ ] Size calculation
- [ ] Other action in menu

## License

MIT © [iYaroslav](https://github.com/iYaroslav)
