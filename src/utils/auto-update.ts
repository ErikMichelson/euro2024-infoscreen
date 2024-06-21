export const autoUpdate = async () => {
  fetch('/build-hash.txt', { cache: 'no-store' })
    .then((response) => response.text())
    .then((hash) => {
      if (!hash) {
        console.error('No hash found')
        return
      }
      if (!localStorage.getItem('build-hash')) {
        localStorage.setItem('build-hash', hash)
        return
      }
      if (localStorage.getItem('build-hash') !== hash) {
        console.info('New build detected, reloading...')
        localStorage.setItem('build-hash', hash)
        window.location.reload()
      }
    })
    .catch((error) => {
      console.error('Error fetching build hash:', error)
    })
}
