import MicroModal from './micromodal.js'
import './prism.js'

const currentPath = window.location.pathname
const externalLinks = {
  '1.x.x': [
    ['Introduction', 'index.html'],
    ['Getting Started', 'getting-started.html'],
    ['Configuration', 'configuration.html'],
    // ['Plugins', 'plugins.html'],
    ['API Reference', 'api-reference.html'],
    ['FAQ', 'faq.html']
  ],
  '0.9.1': [
    ['Introduction', 'index.html'],
    ['Getting Started', 'getting-started.html'],
    ['Configuration', 'configuration.html'],
    // ['Plugins', 'plugins.html'],
    ['API Reference', 'api-reference.html'],
    ['FAQ', 'faq.html']
  ]
}
const versionFolders = [
  ['1.x.x', ''], // Directly in current domain
  ['0.9.1', 'v0']
]

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
const sectionsDropdown = document.getElementById('sections-dropdown')
const sectionPickerList = document.getElementById('section-picker')
const otherLinksPicker = document.getElementById('other-links-picker')

const versionsDropdown = document.getElementById('versions-dropdown')
const currentVersionEl = document.getElementById('current-version')
const versionPickerBtn = document.getElementById('version-picker-button')

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

function updateSectionPositions () {
  Array.prototype.forEach.call(sectionElements, function (e) {
    sections[e.id].position = e.offsetTop - 64
  })
}

// Dropdowns
const dropdowns = {
  versions: {
    elem: versionsDropdown,
    btn: versionPickerBtn,
    opened: false
  },
  sections: {
    elem: sectionsDropdown,
    btn: sectionPickerBtn,
    opened: false
  }
}
const DROPDOWN_ANIM_MS = 240

function openDropdown (dropdown) {
  // Check if not opened
  const curDropdown = dropdowns[dropdown]
  if (curDropdown?.opened === false) {
    curDropdown.elem.classList.remove('hidden', 'dropdown-closing')
    curDropdown.elem.setAttribute('aria-hidden', 'false')
    curDropdown.btn.setAttribute('aria-expanded', 'true')
    curDropdown.opened = true
    updateSectionPositions()

    // allow reflow before open animation
    window.setTimeout(() => {
      curDropdown.elem.classList.add('dropdown-opening')
      curDropdown.btn.querySelector('.dropdown-arrow').style.transform = 'rotateX(180deg)'

      // swap animation class to stable open after animation
      window.setTimeout(() => {
        curDropdown.elem.classList.remove('dropdown-opening')
        curDropdown.elem.classList.add('dropdown-open')
      }, DROPDOWN_ANIM_MS)
    }, 0)
  }
}

function closeDropdown (dropdown) {
  // Check if opened
  const curDropdown = dropdowns[dropdown]
  if (curDropdown?.opened === true) {
    curDropdown.elem.classList.remove('dropdown-opening', 'dropdown-open')
    curDropdown.elem.classList.add('dropdown-closing')
    curDropdown.elem.setAttribute('aria-hidden', 'true')
    curDropdown.btn.setAttribute('aria-expanded', 'false')
    curDropdown.btn.querySelector('.dropdown-arrow').style.transform = ''
    curDropdown.opened = false

    // hide after animation
    window.setTimeout(() => {
      curDropdown.elem.classList.add('hidden')
      curDropdown.elem.classList.remove('dropdown-closing')
      updateSectionPositions()
    }, DROPDOWN_ANIM_MS)
  }
}

// Toggle dropdown when button is clicked
versionPickerBtn.addEventListener('click', function (e) {
  e.preventDefault()
  if (dropdowns.versions.opened) {
    closeDropdown('versions')
  } else {
    openDropdown('versions')
  }
})

sectionPickerBtn.addEventListener('click', function (e) {
  e.preventDefault()
  if (dropdowns.sections.opened) {
    closeDropdown('sections')
  } else {
    openDropdown('sections')
  }
})

// Close dropdown when clicking outside
document.addEventListener('click', function (ev) {
  if (dropdowns.versions.opened) {
    const target = ev.target
    if (!versionsDropdown.contains(target) && target !== versionPickerBtn && !versionPickerBtn.contains(target)) {
      closeDropdown('versions')
    }
  }
  if (dropdowns.sections.opened) {
    const target = ev.target
    if (!sectionsDropdown.contains(target) && target !== sectionPickerBtn && !sectionPickerBtn.contains(target)) {
      closeDropdown('sections')
    }
  }
})

// Close on Escape key globally
document.addEventListener('keydown', function (ev) {
  const isEsc = ev.key === 'Escape'
  if (isEsc && dropdowns.versions.opened) closeDropdown('versions')
  if (isEsc && dropdowns.sections.opened) closeDropdown('sections')
})

window.onload = function () {
  // For sections
  sectionElements = document.querySelectorAll('.heading')
  let sectionsElHTML = ''
  let sectionPickerHTML = ''

  Array.prototype.forEach.call(sectionElements, function (e) {
    // Add section navigation links
    sectionsElHTML += '<li class="lh-copy pv2 ba bl-0 bt-0 br-0 b--dotted b--black-10"><a href="#' + e.id + '" class="navlink">' + e.innerText + '</a></li>'
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

  sectionsEl.innerHTML = sectionsElHTML
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

  // For external links and links to other versions

  // Get the current version number and display it to the user
  let currentVersion = versionFolders[0][0] // Default to latest
  Array.prototype.forEach.call(versionFolders, function (e) {
    const folder = e[1]
    if (currentPath.includes('/' + folder + '/') || (folder === '' && !currentPath.match(/\/v[0-9]+/))) {
      currentVersion = e[0]
    }
  })
  currentVersionEl.innerText = currentVersion

  // Show the outdated version warning if not latest
  if (currentVersion !== versionFolders[0][0]) {
    const warningEl = document.getElementById('outdated-version-warning')
    warningEl.classList.remove('hidden')
  }

  // Derive the domain
  let domain = currentPath.replace(/\/v[0-9]+/, '') // strip version folder
  let linkToReplace = ''
  Array.prototype.forEach.call(externalLinks[currentVersion], function (e) {
    if (domain.endsWith(e[1])) linkToReplace = e[1]
  })
  domain = domain.replace(linkToReplace, '') // strip page
  if (!domain.endsWith('/')) domain += '/'

  // Display a list of available versions
  let versionsDropdownHTML = ''
  let currentLinkPrefix = domain
  let currentLink = 'index.html'
  Array.prototype.forEach.call(versionFolders, function (e) {
    // Add navigation links
    const externalLinksList = externalLinks[e[0]]
    let linkTo = 'index.html' // Default link
    Array.prototype.forEach.call(externalLinksList, function (link) {
      if (currentPath.endsWith(link[1]) || (link[1] === 'index.html' && currentPath.endsWith('/'))) {
        linkTo = link[1]
      }
    })

    if (e[0] === currentVersion) {
      currentLinkPrefix = domain + (e[1] ? e[1] + '/' : '')
      currentLink = linkTo
    }
    linkTo = domain + (e[1] ? e[1] + '/' : '') + linkTo
    versionsDropdownHTML += '<li role="none" class="lh-copy pv2 ba bl-0 bt-0 br-0 b--dotted b--black-10"><a role="menuitem" href="' + linkTo + '" class="navlink' + (e[0] === currentVersion ? ' active' : '') + '">' + e[0] + '</a></li>'
  })
  versionsDropdown.innerHTML = versionsDropdownHTML

  // Display other links
  let otherLinksHTML = ''
  let otherLinksPickerHTML = ''
  Array.prototype.forEach.call(externalLinks[currentVersion], function (e) {
    // Add section navigation links
    let linkTo = currentLinkPrefix + e[1]
    if (linkTo === currentLinkPrefix + currentLink) linkTo = '#'

    otherLinksHTML += '<li class="lh-copy pv2 ba bl-0 bt-0 br-0 b--dotted b--black-10"><a href="' + linkTo + '" class="navlink' + (e[1] === currentLink ? ' active' : '') + '">' + e[0] + '</a></li>'
    otherLinksPickerHTML += '<li role="none" class="lh-copy pv2 ba bl-0 bt-0 br-0 b--dotted b--black-10"><a role="menuitem" href="' + linkTo + '" class="navlink' + (e[1] === currentLink ? ' active' : '') + '">' + e[0] + '</a></li>'
  })
  otherLinksEl.innerHTML = otherLinksHTML
  otherLinksPicker.innerHTML = otherLinksPickerHTML
}

sectionsDropdown.addEventListener('click', function (e) {
  if (!e.target.closest('a[href^="#"]')) return
  closeDropdown('sections')
})

window.onscroll = highlightPageSection
