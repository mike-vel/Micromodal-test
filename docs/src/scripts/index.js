import MicroModal from './micromodal.js'
import './prism.js'

const domainSite = 'micromodal.vercel.app'

// Theme handling
const themeToggle = document.getElementById('theme-toggle')
const root = document.documentElement
const stored = localStorage.getItem('site-theme') // eslint-disable-line no-undef
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

function applyTheme (theme) {
  root.setAttribute('data-theme', theme)
  const isDark = theme === 'dark'
  themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false')
  themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙'
  localStorage.setItem('site-theme', theme) // eslint-disable-line no-undef
}

if (stored) {
  applyTheme(stored)
} else {
  applyTheme(prefersDark ? 'dark' : 'light')
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    applyTheme(current === 'dark' ? 'light' : 'dark')
  })
}

// Initial config for setting up modals
MicroModal.init({
  openTrigger: 'data-custom-open',
  disableScroll: false,
  awaitCloseAnimation: true
})

// Programmatically show modal
document.querySelector('.js-modal-trigger')?.addEventListener('click', function (event) {
  MicroModal.show('modal-2', {
    debugMode: true,
    disableScroll: true,
    onShow: function (modal) { document.querySelector('.js-body').classList.add(modal.id) },
    onClose: function (modal) { document.querySelector('.js-body').classList.remove(modal.id) },
    closeTrigger: 'data-custom-close',
    awaitCloseAnimation: true
  })
})

document.querySelector('.js-modal-close-trigger')?.addEventListener('click', function (event) {
  event.preventDefault()
  MicroModal.close('modal-2')
})

// Scrollspy
const sections = {}

// Aside navigation elements
const sectionsEl = document.getElementById('sections')
const otherLinksEl = document.getElementById('other-links')

// Navigation dropdown elements
const sectionPickerBtn = document.getElementById('section-picker-button')
const currentSectionEl = document.getElementById('current-section')
const dropdownArrowEl = document.getElementById('dropdown-arrow')
const sectionsDropdown = document.getElementById('sections-dropdown')
const sectionPickerList = document.getElementById('section-picker')
const otherLinksPicker = document.getElementById('other-links-picker')

let dropdownOpen = false
const DROPDOWN_ANIM_MS = 240

function openDropdown () {
  if (dropdownOpen) return // already open

  sectionsDropdown.classList.remove('hidden', 'dropdown-closing')
  sectionsDropdown.setAttribute('aria-hidden', 'false')
  sectionPickerBtn.setAttribute('aria-expanded', 'true')
  dropdownOpen = true
  updateSectionPositions()

  // allow reflow before open animation
  window.setTimeout(() => {
    sectionsDropdown.classList.add('dropdown-opening')
    dropdownArrowEl.style.transform = 'rotate(180deg)'

    // swap animation class to stable open after animation
    window.setTimeout(() => {
      sectionsDropdown.classList.remove('dropdown-opening')
      sectionsDropdown.classList.add('dropdown-open')
    }, DROPDOWN_ANIM_MS)
  }, 0)
}

function closeDropdown () {
  if (!dropdownOpen) return // already hidden

  sectionsDropdown.classList.remove('dropdown-opening', 'dropdown-open')
  sectionsDropdown.classList.add('dropdown-closing')
  sectionsDropdown.setAttribute('aria-hidden', 'true')
  sectionPickerBtn.setAttribute('aria-expanded', 'false')
  dropdownArrowEl.style.transform = ''
  dropdownOpen = false

  // hide after animation
  window.setTimeout(() => {
    sectionsDropdown.classList.add('hidden')
    sectionsDropdown.classList.remove('dropdown-closing')
    updateSectionPositions()
  }, DROPDOWN_ANIM_MS)
}

// Toggle dropdown when button is clicked
sectionPickerBtn.addEventListener('click', function (e) {
  e.preventDefault()
  if (dropdownOpen) {
    closeDropdown()
  } else {
    openDropdown()
  }
})
// Close dropdown if Escape key is pressed
sectionPickerBtn.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeDropdown()
  }
})

// Close dropdown when clicking outside
document.addEventListener('click', function (ev) {
  if (!sectionsDropdown || !dropdownOpen) return
  const target = ev.target
  if (!sectionsDropdown.contains(target) && target !== sectionPickerBtn && !sectionPickerBtn.contains(target)) {
    closeDropdown()
  }
})

// Close on Escape key globally
document.addEventListener('keydown', function (ev) {
  if (ev.key === 'Escape' && dropdownOpen) closeDropdown()
})

const highlightPageSection = function () {
  const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop

  for (const section in sections) {
    if (sections[section].position <= scrollPosition) {
      const prev = [
        sectionsEl.querySelector('.active'),
        sectionPickerList.querySelector('.active')
      ].filter(Boolean)
      Array.prototype.forEach.call(prev, function (e) {
        e.classList.remove('active')
      })

      const highlightLinks = [
        sectionsEl.querySelector('a[href=\\#' + section + ']'),
        sectionPickerList.querySelector('a[href=\\#' + section + ']')
      ].filter(Boolean)
      Array.prototype.forEach.call(highlightLinks, function (e) {
        e.classList.add('active')
      })

      // Update section picker label
      currentSectionEl.innerText = sections[section].name
    }
  }
}

let sectionElements

function updateSectionPositions() {
  Array.prototype.forEach.call(sectionElements, function (e) {
    sections[e.id].position = e.offsetTop - 64
  })
}

window.onload = function () {
  sectionElements = document.querySelectorAll('.heading')
  let sectionHTML = ''
  let sectionPickerHTML = ''

  Array.prototype.forEach.call(sectionElements, function (e) {
    // Add section navigation links
    sectionHTML += '<li class="lh-copy pv2 ba bl-0 bt-0 br-0 b--dotted b--black-10"><a href="#' + e.id + '" class="navlink">' + e.innerText + '</a></li>'
    sectionPickerHTML += '<li role="none" class="lh-copy pv2 ba bl-0 bt-0 br-0 b--dotted b--black-10"><a role="menuitem" href="#' + e.id + '" class="navlink">' + e.innerText + '</a></li>'

    // Store section names
    sections[e.id] = {
      name: e.innerText,
      position: e.offsetTop - 64
    }

    // Add anchor links to headings
    e.innerHTML = e.innerHTML + ' <a class="link" href="#' + e.id + '" aria-label="Anchor link to heading">🔗</a>'
  })

  // Store section positions
  updateSectionPositions()
  window.addEventListener('resize', function () {
    updateSectionPositions()
  })

  sectionsEl.innerHTML = sectionHTML
  sectionPickerList.innerHTML = sectionPickerHTML

  // Highlight first section on load
  const first = sectionElements[0]
  if (first) {
    const firstLinks = [
      sectionsEl.querySelector('a[href=\\#' + first.id + ']'),
      sectionPickerList.querySelector('a[href=\\#' + first.id + ']')
    ].filter(Boolean)
    firstLinks.forEach(e => e.classList.add('active'))
    // Also apply in section picker label
    currentSectionEl.innerText = sections[first.id].name
  }
  highlightPageSection()
}

sectionsDropdown.addEventListener('click', function (e) {
  if (!e.target.closest('a[href^="#"]')) return
  closeDropdown()
})

window.onscroll = highlightPageSection
