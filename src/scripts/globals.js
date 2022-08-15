// import * as Events from '../node_modules/minivents'
const Model = require('./Model.js')
const Events = require('minivents/dist/minivents.commonjs')
// window.$ = require('jquery/dist/jquery.slim')
// window._ = require('underscore/underscore')

window.states = {
  get NEW() {
    return 'new'
  },
  get FADED() {
    return 'faded'
  },
  get PAINTING() {
    return 'painting'
  },
  get PAUSED() {
    return 'paused'
  },
}

window.actions = {
  get KEY_DOWN() {
    return 'KEY_DOWN'
  },
  get TRIGGER() {
    return 'trigger'
  },
  get NEW() {
    return 'new'
  },
  get SNAPSHOT() {
    return 'snapshot'
  },
  get TOGGLE_CONTROLS() {
    return 'TOGGLE_CONTROLS'
  },
  get CHANGE_CAMERA() {
    return 'CHANGE_CAMERA'
  },
  get OPACITY() {
    return 'OPACITY'
  },
  get MIRROR() {
    return 'MIRROR'
  },
  get GHOST() {
    return 'GHOST'
  },
  get TOGGLE_LOGO() {
    return 'TOGGLE_LOGO'
  }
}
Events(actions)

function store(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getStored(key) {
  return JSON.parse(localStorage.getItem(key))
}

window.appModel = new Model({
  version: require('../../package.json').version,

  camera: undefined,
  cameras: [],
  cameraNames: [],
  resolution: '1280:720',
  opacity: 100,
  decay: 0,
  mirror: true,
  ghost: 0,
  videoFile: undefined,
  videoElement: undefined,

  triggerControls: true,
  loopVideo: true,
  proDesktop: true,
  recordVideo: false,
  autoSnapshot: true,
  saveDir: undefined,

  state: states.NEW,

  resolutions: [
    // '4096:2160',
    // '2560:1440',
    '1920:1080',
    '1280:720',
    '960:540',
    '640:480',
    '640:360',
  ]
})

appModel.watch('cameras', () => {
  console.log(appModel.cameras)
  appModel.cameraNames = JSON.parse(appModel.cameras).map(cam => cam.label).concat('Video file')
})

/*

    initialization

*/

var storableProperties = [
  'saveDir',
  'mode',
  'camera',
  'resolution',
  'opacity',
  'decay',
  'ghost',
  'mirror',
  'recordVideo',
  'autoSnapshot',
  'videoFile',
  'loopVideo',
  'triggerControls',
]

// get the values from local storage
storableProperties.forEach((key) => {
  var val = getStored(key)
  if (val !== undefined && val !== null) {
    appModel[key] = val
  }
})

storableProperties.forEach((key) => {
  appModel.watch(key, (value, oldValue, silent) => {
    // console.log(key, value, silent)
    store(key, value)
  })
})
