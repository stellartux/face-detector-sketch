const $ = sel => document.querySelector(sel),
  canvas = $('canvas'),
  ctx = canvas.getContext('2d'),
  params = (new URL(document.location)).searchParams
if (params.has('url')) {
  $('input').value = params.get('url')
}

let faceDetector

if (window.FaceDetector) {
  faceDetector = new FaceDetector()
} else {
  $('#flag-info').classList.remove('hidden')
}

function loadImage(url) {
  return new Promise(then => { 
    const img = new Image() 
    img.setAttribute('crossorigin', 'anonymous')
    img.src = url;
    img.onload = () => then(img)
  })
}

$('form').onsubmit = async ev => {
  ev.preventDefault()
  const image = await loadImage(ev.srcElement[0].value)
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  ctx.strokeStyle = 'black'

  const faces = await faceDetector.detect(image)
  faces.forEach(face => {
    const box = face.boundingBox,
      r = Math.max(box.width, box.height) / 2,
      tau = 2 * Math.PI

    ctx.fillStyle = 'yellow'
    ctx.beginPath()
    ctx.arc(box.x + r, box.y + r, r * 1.5, 0, tau)
    ctx.fill()    
    ctx.stroke()

    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.arc(box.x + r * 0.45, box.y + r * 0.75, r * 0.25, 0, tau)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(box.x + r * 1.55, box.y + r * 0.75, r * 0.25, 0, tau)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(box.x + r, box.y + r, r * 0.85, Math.PI / 2 - 1, Math.PI / 2 + 1)
    ctx.stroke()
  })
}

$('button').click()