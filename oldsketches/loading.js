// Date: 2015-05-21
// Ported to JS: 2024-10-16

import * as $dom from '../lib/dom.js'

const width = 192
const height = 192

const STROKE_WIDTH = 6
const NORMAL_RADIUS = 128
let CIRCLE_RADIUS = 0
const ZOOM_TIME = 256
const WAIT_TIME = 1000

let loadAmount = 0

let startMillis = 0
let stopMillis = -1

/** @type {CanvasRenderingContext2D} */
let ctx

function setup() {
  let canvas = $dom.create('canvas', {width, height}, document.body)
  ctx = canvas.getContext('2d')
  ctx.font = '12px sans-serif'
}

/**
 * @param {number} millis
 */
function draw(millis) {
  window.requestAnimationFrame(draw)
  millis -= startMillis

  if(millis - WAIT_TIME < ZOOM_TIME) {
    CIRCLE_RADIUS = (millis - WAIT_TIME) / ZOOM_TIME * NORMAL_RADIUS
  } else {
    CIRCLE_RADIUS = NORMAL_RADIUS
  }

  if(stopMillis == -1) {
    if(loadAmount >= 1) {
      stopMillis = millis
    }
  } else {
    if(millis - stopMillis < ZOOM_TIME) {
      CIRCLE_RADIUS = NORMAL_RADIUS - ((millis - stopMillis) / ZOOM_TIME * NORMAL_RADIUS)
    } else {
      CIRCLE_RADIUS = 0
    }
  }

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
  let loadingColor = `hsl(${(millis / 135) % 360} 100% 44%)`
  loadAmount = (millis - WAIT_TIME) / 10000.0

  ctx.strokeStyle = loadingColor
  ctx.lineWidth = STROKE_WIDTH
  arcCircle(width/2, height/2, CIRCLE_RADIUS, millis / 512.0, millis / 128.0)

  ctx.fillStyle = loadingColor
  drawLoading(width/2, height/2, CIRCLE_RADIUS - (STROKE_WIDTH / 2), loadAmount)
}

/**
 * @param {number} xPos
 * @param {number} yPos
 * @param {number} radius
 * @param {number} start
 * @param {number} end
 */
function arcCircle(xPos, yPos, radius, start, end) {
  if(radius <= 0) {
    return
  }

  let arcLength = (end - start) % (4*Math.PI)

  end = ((end - start) % (2*Math.PI)) + start //Is this necessary?

  ctx.beginPath()
  if(arcLength <= 2*Math.PI) {
    ctx.arc(xPos, yPos, radius / 2, start, end)
  } else {
    ctx.arc(xPos, yPos, radius / 2, end, start + 2*Math.PI)
  }
  ctx.stroke()
}

/**
 * @param {number} xPos
 * @param {number} yPos
 * @param {number} radius
 * @param {number} amount 1 is completely loaded
 */
function drawLoading(xPos, yPos, radius, amount) {
  if(amount > 1) {
    amount = 1
  }
  if(amount < 0) {
    amount = 0
  }

  ctx.beginPath()
  if(radius > 0) {
    ctx.arc(xPos, yPos, radius / 2, -(Math.PI/2), -(Math.PI/2) + (amount * Math.PI*2))
    ctx.lineTo(xPos, yPos)
  }
  ctx.fill()

  if(radius >= 16) {
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(Math.floor(amount * 100) + "%", xPos, yPos)
  }
}

setup()
startMillis = window.performance.now()
draw(startMillis)
