import MicroModal from './micromodal.js'
import './prism.js'

// Initial config for setting up modals
MicroModal.init({
  openTrigger: 'data-custom-open',
  disableScroll: false,
  awaitCloseAnimation: true
})

// Programmatically show modal
document.querySelector('.js-modal-trigger').addEventListener('click', function (event) {
  MicroModal.show('modal-2', {
    debugMode: true,
    disableScroll: true,
    onShow: function (modal) { document.querySelector('.js-body').classList.add(modal.id) },
    onClose: function (modal) { document.querySelector('.js-body').classList.remove(modal.id) },
    closeTrigger: 'data-custom-close',
    awaitCloseAnimation: true
  })
})

document.querySelector('.js-modal-close-trigger').addEventListener('click', function (event) {
  event.preventDefault()
  MicroModal.close('modal-2')
})

// Scrollspy
const sections = {}
const highlightPageSection = function () {
  const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop

  for (const section in sections) {
    if (sections[section] <= scrollPosition) {
      document.querySelector('.active').classList.remove('blue', 'fw6', 'active')
      document.querySelector('a[href*=' + section + ']').classList.add('blue', 'fw6', 'active')
    }
  }
}

window.onload = function () {
  const sectionElements = document.querySelectorAll('.heading')

  Array.prototype.forEach.call(sectionElements, function (e) {
    // Add section navigation links
    document.getElementById('sections').innerHTML = document.getElementById('sections').innerHTML + '<li class="lh-copy pv2 ba bl-0 bt-0 br-0 b--dotted b--black-10"><a href="#' + e.id + '" class="link black-70 navlink">' + e.innerText + '</a></li>'
    // Add anchor links to headings
    e.innerHTML = e.innerHTML + ' <a class="link" href="#' + e.id + '" aria-label="Anchor link to heading">🔗</a>'

    sections[e.id] = e.offsetTop - 64
  })
  document.querySelector('a[href*=' + sectionElements[0].id + ']').classList.add('active', 'blue', 'fw6')
  highlightPageSection()
}
window.onscroll = highlightPageSection
