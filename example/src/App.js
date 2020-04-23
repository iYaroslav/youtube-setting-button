import React, { useState } from 'react'

import Setting from '@iyaroslav/youtube-settings-button'
import '@iyaroslav/youtube-settings-button/dist/index.css'

const App = () => {
  const [config, setConfig] = useState([{
    key: 'autoplay',
    title: 'Autoplay',
    value: true
  }, {
    key: 'annotations',
    title: 'Annotations',
    value: true
  }, {
    key: 'speed',
    title: 'Playback speed',
    value: 'Normal',
    entries: ['0.5', '0.75', 'Normal', '1.25', '1.5']
  }, {
    key: 'quality',
    title: 'Quality',
    value: 'UHD',
    allowCustomValue: true,
    onOtherValueSelected: () => prompt('Enter value'),
    entries: ['SD', 'HD', 'UHD']
  }])

  return <div style={{
    height: '150vh'
  }}>
    <p>Add <code>position: relative</code> style to body, for correct menu position
    </p>
    <Setting
      style={{
        position: 'absolute',
        top: '25rem',
        left: '50%',
        marginLeft: '-1.6rem'
      }}
      hd
      settings={config}
      onChange={setConfig}
    />
  </div>
}

export default App
